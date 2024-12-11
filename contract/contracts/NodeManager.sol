// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;
import "./BachiNode.sol";
import "./BachiToken.sol";
import "./Staking.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NodeManager is Pausable, AccessControl, Ownable {
    using EnumerableSet for EnumerableSet.UintSet;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    IERC20 public taikoToken;

    BachiNode private bachiNodeContract;
    BachiToken private tokenContract;
    Staking private stakingContract;

    // Node tier
    struct NodeTier {
        uint8 status; // 1 is Running, 2 is Stopped, 3 is Idle
        string name;
        uint256 price;
        uint64 hashrate;
        uint256 farmSpeedBachi;
        uint256 farmSpeedTaiko;
    }

    uint256 public nodeTierId;
    mapping(uint256 => NodeTier) public nodeTiers;
    mapping(uint256 => uint256) public nodeIdNodeTiersIdLinks;
    mapping(address => EnumerableSet.UintSet) private userNodeIdLinks;
    mapping(uint256 => address) public nodeIdUserLinks;

    // Coupon
    uint256 public couponId;
    struct DiscountCoupon {
        bool status;
        uint8 discountPercent;
        string name;
        uint8 commissionPercent;
        string code;
    }
    mapping(uint256 => DiscountCoupon) public discountCoupons;
    mapping(address => EnumerableSet.UintSet)
        private userdiscountCouponsIdLinks;
    mapping(uint256 => address) public discountCouponsIdUserLinks;

    // Referral
    uint8 public referralRate = 10;
    uint256 public referenceId;
    struct ReferralInformation {
        string code;
        uint256 totalSales;
    }
    mapping(uint256 => ReferralInformation) public referrals;
    mapping(address => uint256) public userReferralIdLinks;
    mapping(uint256 => address) public referralIdUserLinks;

    // Events
    event AddedNode(
        address indexed user,
        uint256 nodeTierId,
        uint8 status,
        string name,
        uint256 price,
        uint64 hashrate,
        uint256 farmSpeedBachi,
        uint256 farmSpeedTaiko
    );

    event UpdatedNode(
        address indexed user,
        uint256 nodeTierId,
        uint8 status,
        string name,
        uint256 price,
        uint64 hashrate,
        uint256 farmSpeedBachi,
        uint256 farmSpeedTaiko
    );

    event AddCoupon(
        address indexed user,
        uint256 couponId,
        bool status,
        uint8 discountPercent,
        string name,
        uint8 commissionPercent,
        string code
    );
    event UpdateCoupon(
        address indexed user,
        uint256 couponId,
        bool status,
        uint8 discountPercent,
        string name,
        uint8 commissionPercent
    );
    event Sale(
        address indexed user,
        uint256 nodeTierId,
        uint256 quantity,
        uint256 referralId,
        uint256 totalSales,
        uint256 timestamp
    );
    event Referral(
        address indexed user,
        address indexed owner,
        uint256 referralId,
        uint256 amount,
        uint256 timestamp
    );
    event Deposited(address indexed user, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 value);
    event GeneratedReferralCode(address indexed user, string code);
    event NodeTransferred(
        address indexed previousOwner,
        address indexed newOwner,
        uint256 indexed nodeTierId
    );

    constructor(
        address _bachiNodeContract,
        address _tokenContract,
        address _stakingContract,
        address _taikoTokenAddress
    ) Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        tokenContract = BachiToken(_tokenContract);
        bachiNodeContract = BachiNode(_bachiNodeContract);
        stakingContract = Staking(_stakingContract);
        taikoToken = IERC20(_taikoTokenAddress);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setNodeContractAddress(
        address _bachiNodeContract
    ) public onlyRole(ADMIN_ROLE) {
        bachiNodeContract = BachiNode(_bachiNodeContract);
    }

    function getNodeContractAddress() public view returns (address) {
        return address(bachiNodeContract);
    }

    function setTokenContractAddress(
        address _tokenContract
    ) public onlyRole(ADMIN_ROLE) {
        tokenContract = BachiToken(_tokenContract);
    }

    function getTokenContractAddress() public view returns (address) {
        return address(tokenContract);
    }

    function setTaikoTokenAddress(
        address _taikoTokenAddress
    ) public onlyRole(ADMIN_ROLE) {
        taikoToken = IERC20(_taikoTokenAddress);
    }

    function setStakingContractAddress(
        address _stakingContract
    ) public onlyRole(ADMIN_ROLE) {
        stakingContract = Staking(_stakingContract);
    }

    function getStakingContractAddress() public view returns (address) {
        return address(stakingContract);
    }

    function setReferralRate(uint8 _referralRate) public onlyRole(ADMIN_ROLE) {
        referralRate = _referralRate;
    }

    // NODE TIER MANAGEMENT
    function addNodeTier(
        uint8 status,
        string memory name,
        uint256 price,
        uint64 hashrate,
        uint256 farmSpeedBachi,
        uint256 farmSpeedTaiko
    ) public onlyRole(ADMIN_ROLE) whenNotPaused {
        require(
            hashrate > 0 && farmSpeedBachi > 0 && farmSpeedTaiko > 0,
            "Hashrate and FarmSpeed must be greater than 0"
        );

        nodeTierId++;
        NodeTier memory newNode = NodeTier(
            status,
            name,
            price,
            hashrate,
            farmSpeedBachi,
            farmSpeedTaiko
        );
        nodeTiers[nodeTierId] = newNode;

        emit AddedNode(
            msg.sender,
            nodeTierId,
            nodeTiers[nodeTierId].status,
            name,
            price,
            hashrate,
            farmSpeedBachi,
            farmSpeedTaiko
        );
    }

    function updateNodeTier(
        uint256 _nodeTierId,
        string memory name,
        uint8 status,
        uint256 price,
        uint64 hashrate,
        uint256 farmSpeedBachi,
        uint256 farmSpeedTaiko
    ) public onlyRole(ADMIN_ROLE) whenNotPaused {
        NodeTier memory newNode = nodeTiers[_nodeTierId];
        require(newNode.farmSpeedBachi > 0, "Node tier does not exist");
        require(
            hashrate > 0 && farmSpeedBachi > 0 && farmSpeedTaiko > 0,
            "Hashrate and FarmSpeed must be greater than 0"
        );

        newNode.name = name;
        newNode.status = status;
        newNode.price = price;
        newNode.hashrate = hashrate;
        newNode.farmSpeedBachi = farmSpeedBachi;
        newNode.farmSpeedTaiko = farmSpeedTaiko;
        nodeTiers[_nodeTierId] = newNode;

        emit UpdatedNode(
            msg.sender,
            _nodeTierId,
            newNode.status,
            newNode.name,
            newNode.price,
            newNode.hashrate,
            newNode.farmSpeedBachi,
            newNode.farmSpeedTaiko
        );
    }

    function getNodeIdByIndex(
        address user,
        uint256 index
    ) public view returns (uint256) {
        require(index < userNodeIdLinks[user].length(), "Index out of bounds");
        return userNodeIdLinks[user].at(index);
    }

    function getUserTotalNode(address user) public view returns (uint256) {
        return userNodeIdLinks[user].length();
    }

    function getFarmSpeed(
        uint256 nodeId
    ) public view returns (uint256, uint256) {
        uint256 _nodeTierId = nodeIdNodeTiersIdLinks[nodeId];
        uint256 farmSpeedBachi = nodeTiers[_nodeTierId].farmSpeedBachi;
        uint256 farmSpeedTaiko = nodeTiers[_nodeTierId].farmSpeedTaiko;
        return (farmSpeedBachi, farmSpeedTaiko);
    }

    // COUPON MANAGEMENT
    function addDiscountCoupon(
        uint8 discountPercent,
        string memory name,
        uint8 commissionPercent,
        address owner
    ) public onlyRole(ADMIN_ROLE) whenNotPaused {
        require(discountPercent > 0, "Discount percent must be greater than 0");

        couponId++;
        string memory _code = string(
            abi.encodePacked(
                "BachiSwapCP_",
                uint256str(couponId),
                "_",
                uint256str(block.timestamp)
            )
        );
        DiscountCoupon memory newCoupon = DiscountCoupon(
            true,
            discountPercent,
            name,
            commissionPercent,
            _code
        );
        discountCoupons[couponId] = newCoupon;
        discountCouponsIdUserLinks[couponId] = owner;
        userdiscountCouponsIdLinks[owner].add(couponId);

        emit AddCoupon(
            owner,
            couponId,
            newCoupon.status,
            newCoupon.discountPercent,
            newCoupon.name,
            newCoupon.commissionPercent,
            newCoupon.code
        );
    }

    function updateDiscountCoupon(
        uint256 _couponId,
        uint8 discountPercent,
        bool status,
        string memory name,
        uint8 commissionPercent
    ) public onlyRole(ADMIN_ROLE) whenNotPaused {
        require(
            discountCoupons[_couponId].discountPercent > 0,
            "Coupon does not exist"
        );
        require(discountPercent > 0, "Discount percent must be greater than 0");

        discountCoupons[_couponId].discountPercent = discountPercent;
        discountCoupons[_couponId].status = status;
        discountCoupons[_couponId].name = name;
        discountCoupons[_couponId].commissionPercent = commissionPercent;

        emit UpdateCoupon(
            msg.sender,
            _couponId,
            discountCoupons[_couponId].status,
            discountCoupons[_couponId].discountPercent,
            discountCoupons[_couponId].name,
            discountCoupons[_couponId].commissionPercent
        );
    }

    function multiBuyNode(
        uint256 _nodeTierId,
        uint256 referralId,
        string memory metadata,
        uint256 discountCouponId,
        uint256 quantity,
        uint256 taikoAmount
    ) public whenNotPaused {
        require(
            quantity > 0 && quantity <= 10,
            "quantity must be between 1 and 10"
        );
        require(
            nodeTiers[_nodeTierId].farmSpeedBachi > 0,
            "Node tier does not exist"
        );

        uint256 price = nodeTiers[_nodeTierId].price * quantity;
        uint256 discountValue = calculateDiscount(discountCouponId, price);

        uint256 expectedValue = price - discountValue;

        processTaikoTransfer(expectedValue, taikoAmount);

        uint256 totalSales = handleReferral(referralId, expectedValue);

        mintNodes(_nodeTierId, quantity, metadata);

        if (userReferralIdLinks[msg.sender] == 0) {
            referenceId++;
            uint256 currentTimestamp = block.timestamp;
            string memory _code = string(
                abi.encodePacked(
                    "BachiSwap_",
                    uint256str(referenceId),
                    "_",
                    uint256str(currentTimestamp)
                )
            );
            userReferralIdLinks[msg.sender] = referenceId;
            referralIdUserLinks[referenceId] = msg.sender;
            referrals[referenceId].code = _code;
            emit GeneratedReferralCode(msg.sender, _code);
        }

        emit Sale(
            msg.sender,
            _nodeTierId,
            quantity,
            referralId,
            totalSales,
            block.timestamp
        );
    }

    function calculateDiscount(
        uint256 discountCouponId,
        uint256 price
    ) internal returns (uint256) {
        if (
            discountCouponId != 0 &&
            discountCouponsIdUserLinks[discountCouponId] != msg.sender
        ) {
            DiscountCoupon memory coupon = discountCoupons[discountCouponId];
            require(
                coupon.discountPercent > 0,
                "Discount coupon does not exist"
            );
            require(coupon.status, "Discount coupon is not active");

            uint256 discountValue = (price * coupon.discountPercent) / 100;
            address discountOwner = discountCouponsIdUserLinks[
                discountCouponId
            ];
            uint256 commissionValue = (price * coupon.commissionPercent) / 100;

            // Reward Taiko token as commission
            stakingContract.updateRewardAmount(
                discountOwner,
                0,
                commissionValue
            );
            return discountValue;
        }
        return 0;
    }

    function processTaikoTransfer(
        uint256 expectedValue,
        uint256 taikoAmount
    ) internal {
        require(taikoAmount == expectedValue, "Insufficient funds");
        require(
            taikoToken.allowance(msg.sender, address(this)) >= taikoAmount,
            "Insufficient Taiko token allowance"
        );

        bool taikoTransferSuccess = taikoToken.transferFrom(
            msg.sender,
            address(this),
            taikoAmount
        );
        require(taikoTransferSuccess, "Taiko token transfer failed");
    }

    function handleReferral(
        uint256 referralId,
        uint256 expectedValue
    ) internal returns (uint256) {
        if (
            referralId > 0 &&
            referralIdUserLinks[referralId] != address(0) &&
            referralIdUserLinks[referralId] != msg.sender
        ) {
            address referralsOwner = referralIdUserLinks[referralId];
            uint256 totalSales = (expectedValue * referralRate) / 100;

            // Reward Taiko token for referral
            stakingContract.updateRewardAmount(referralsOwner, 0, totalSales);

            referrals[referralId].totalSales += totalSales;
            emit Referral(
                msg.sender,
                referralsOwner,
                referralId,
                totalSales,
                block.timestamp
            );

            return totalSales;
        }
        return 0;
    }

    function mintNodes(
        uint256 _nodeTierId,
        uint256 quantity,
        string memory metadata
    ) internal {
        for (uint256 i = 0; i < quantity; i++) {
            uint256 nodeId = bachiNodeContract.lastTokenId() + 1;
            bachiNodeContract.safeMint(
                address(stakingContract),
                nodeId,
                metadata
            );
            nodeIdNodeTiersIdLinks[nodeId] = _nodeTierId;
            userNodeIdLinks[msg.sender].add(nodeId);
            nodeIdUserLinks[nodeId] = msg.sender;
            stakingContract.autoStake(nodeId, msg.sender);
        }
    }

    function generateReferralCodeIfNeeded(
        address caller
    ) public onlyRole(ADMIN_ROLE) returns (string memory) {
        if (userReferralIdLinks[caller] == 0) {
            referenceId++;
            uint256 currentTimestamp = block.timestamp;
            string memory _code = string(
                abi.encodePacked(
                    "BachiSwap_",
                    uint256str(referenceId),
                    "_",
                    uint256str(currentTimestamp)
                )
            );
            userReferralIdLinks[caller] = referenceId;
            referralIdUserLinks[referenceId] = caller;
            referrals[referenceId].code = _code;

            emit GeneratedReferralCode(caller, _code);
            return _code;
        }
        return "";
    }

    function getDiscountIdByIndex(
        address user,
        uint256 index
    ) public view returns (uint256) {
        require(
            index < userdiscountCouponsIdLinks[user].length(),
            "Index out of bounds"
        );
        return userdiscountCouponsIdLinks[user].at(index);
    }

    function getTotalDiscountByOwner(
        address owner
    ) public view returns (uint256) {
        return userdiscountCouponsIdLinks[owner].length();
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Deposit amount must be greater than zero");
        require(
            taikoToken.balanceOf(msg.sender) >= amount,
            "Insufficient Taiko token balance"
        );
        require(
            taikoToken.allowance(msg.sender, address(this)) >= amount,
            "Insufficient Taiko token allowance"
        );

        bool success = taikoToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "Failed to transfer Taiko token");

        emit Deposited(msg.sender, amount);
    }

    function withdraw(address to, uint256 value) public onlyOwner {
        require(
            taikoToken.balanceOf(address(this)) >= value,
            "Insufficient Taiko token balance"
        );

        bool sent = taikoToken.transfer(to, value);
        require(sent, "Failed to send Taiko token");

        emit FundsWithdrawn(to, value);
    }

    // Helper function to convert uint256 to string
    function uint256str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
