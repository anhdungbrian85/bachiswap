// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;
import "./Staking.sol";
import "./NodeManager.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract QuestManager is Pausable, AccessControl, Ownable {
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    Staking public stakingContract;
    NodeManager public nodeManagerContract;

    uint8 public taskId;
    enum RewardType {
        bachi,
        taiko,
        bachiAndTaiko
    }
    struct TaskInformation {
        string code;
        uint point;
        RewardType rewardType;
    }

    mapping(uint8 => TaskInformation) public tasksInfo;
    mapping(address => EnumerableSet.UintSet) private userTasksLinks;
    mapping(uint => EnumerableSet.AddressSet) private taskUsersLinks;
    mapping(address => uint) public rewardBalances;

    mapping(address => mapping(uint256 => uint256)) public dailyclaims; // address => taskId => claimTime

    // Events
    event AddedTask(
        address indexed user,
        uint taskId,
        string code,
        uint point,
        RewardType rewardType
    );

    event UpdatedTask(
        address indexed user,
        uint taskId,
        string code,
        uint point,
        RewardType rewardType
    );

    event CompleteTask(
        address indexed user,
        uint taskId,
        string code,
        uint point
    );

    event CompleteTaskDaily(
        address indexed user,
        uint taskId,
        string code,
        uint point,
        uint claimTime
    );

    constructor(
        address _stakingContract,
        address _nodeManagerContract
    ) Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        stakingContract = Staking(_stakingContract);
        nodeManagerContract = NodeManager(_nodeManagerContract);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setStakingContractAddress(
        address _stakingContract
    ) public onlyRole(ADMIN_ROLE) {
        stakingContract = Staking(_stakingContract);
    }

    function getNodeStakingContractAddress() public view returns (address) {
        return address(stakingContract);
    }

    function setNodeManagerContractAddress(
        address _nodeManagerContract
    ) public onlyRole(ADMIN_ROLE) {
        nodeManagerContract = NodeManager(_nodeManagerContract);
    }

    function getNodeManagerContractAddress() public view returns (address) {
        return address(nodeManagerContract);
    }

    function addTask(
        string memory code,
        uint point,
        RewardType rewardType
    ) public whenNotPaused onlyRole(ADMIN_ROLE) {
        require(point > 0, "Point must be greater than 0");
        require(bytes(code).length > 0, "Code name must not be empty");

        taskId++;
        TaskInformation memory newTask = TaskInformation(
            code,
            point,
            rewardType
        );
        tasksInfo[taskId] = newTask;

        emit AddedTask(msg.sender, taskId, code, point, rewardType);
    }

    function updateTask(
        uint8 _taskId,
        string memory code,
        uint point,
        RewardType rewardType
    ) public whenNotPaused onlyRole(ADMIN_ROLE) {
        require(tasksInfo[_taskId].point > 0, "Task does not exist");
        require(point > 0, "Point must be greater than 0");
        require(bytes(code).length > 0, "Code name must not be empty");

        tasksInfo[_taskId].code = code;
        tasksInfo[_taskId].point = point;
        tasksInfo[_taskId].rewardType = rewardType;

        emit UpdatedTask(msg.sender, taskId, code, point, rewardType);
    }

    function completeTask(uint8 _taskId) public whenNotPaused {
        address user = msg.sender;
        require(_taskId != 1 && _taskId != 4, "Invalid task");
        TaskInformation memory taskInfo = tasksInfo[_taskId];
        require(taskInfo.point > 0, "Task does not exist");
        require(
            !isUserCompletedByTask(_taskId, user) &&
                !isTaskCompletedByUser(user, _taskId),
            "Task is completed"
        );
        userTasksLinks[user].add(_taskId);
        taskUsersLinks[_taskId].add(user);
        rewardBalances[user] += taskInfo.point;

        if (taskInfo.rewardType == RewardType.bachi) {
            stakingContract.updateRewardAmount(user, taskInfo.point, 0);
        } else if (taskInfo.rewardType == RewardType.taiko) {
            stakingContract.updateRewardAmount(user, 0, taskInfo.point);
        }
        emit CompleteTask(user, _taskId, taskInfo.code, taskInfo.point);
    }

    function completeTaskDaily() public whenNotPaused {
        uint8 _taskId = 4;
        address user = msg.sender;
        uint lastClaimTime = dailyclaims[user][_taskId];
        uint claimTime = block.timestamp;
        TaskInformation memory taskInfo = tasksInfo[_taskId];
        require(taskInfo.point > 0, "Task does not exist");
        require(
            getDay(claimTime) > getDay(lastClaimTime),
            "Task already claimed today"
        );
        if (
            !isUserCompletedByTask(_taskId, user) &&
            !isTaskCompletedByUser(user, _taskId)
        ) {
            userTasksLinks[user].add(_taskId);
            taskUsersLinks[_taskId].add(user);
        }
        dailyclaims[user][_taskId] = claimTime;
        rewardBalances[user] += taskInfo.point;

        if (taskInfo.rewardType == RewardType.bachi) {
            stakingContract.updateRewardAmount(user, taskInfo.point, 0);
        } else if (taskInfo.rewardType == RewardType.taiko) {
            stakingContract.updateRewardAmount(user, 0, taskInfo.point);
        }

        emit CompleteTaskDaily(
            user,
            _taskId,
            taskInfo.code,
            taskInfo.point,
            claimTime
        );
    }

    function completeReferralTask() public whenNotPaused {
        address user = msg.sender;
        uint8 _taskId = 1;
        string memory code = nodeManagerContract.generateReferralCodeIfNeeded(msg.sender);
        require(bytes(code).length > 0, "Referral generated");
        TaskInformation memory taskInfo = tasksInfo[_taskId];
        require(taskInfo.point > 0, "Task does not exist");
        require(
            !isUserCompletedByTask(_taskId, user) &&
                !isTaskCompletedByUser(user, _taskId),
            "Task is completed"
        );
        userTasksLinks[user].add(_taskId);
        taskUsersLinks[_taskId].add(user);
        rewardBalances[user] += taskInfo.point;

        if (taskInfo.rewardType == RewardType.bachi) {
            stakingContract.updateRewardAmount(user, taskInfo.point, 0);
        } else if (taskInfo.rewardType == RewardType.taiko) {
            stakingContract.updateRewardAmount(user, 0, taskInfo.point);
        }
        emit CompleteTask(user, _taskId, taskInfo.code, taskInfo.point);
    }

    function getDay(uint timestamp) internal pure returns (uint) {
        return timestamp / 1 days;
    }

    function getDailyClaimTime(
        address user,
        uint8 _taskId
    ) public view returns (uint) {
        return dailyclaims[user][_taskId];
    }

    function isTaskDailyCompletedByUser(
        address user,
        uint8 _taskId
    ) public view returns (bool) {
        uint lastClaimTime = dailyclaims[user][_taskId];
        if (lastClaimTime == 0) return false;
        if (getDay(block.timestamp) == getDay(lastClaimTime)) {
            return true;
        }

        return false;
    }

    function isTaskCompletedByUser(
        address user,
        uint8 _taskId
    ) public view returns (bool) {
        return userTasksLinks[user].contains(_taskId);
    }

    function totalTaskCompletedByUser(address user) public view returns (uint) {
        return userTasksLinks[user].length();
    }

    function getTaskUserCompletedByIndex(
        address user,
        uint256 index
    ) public view returns (uint) {
        require(index < userTasksLinks[user].length(), "Index out of bounds");
        return userTasksLinks[user].at(index);
    }

    function isUserCompletedByTask(
        uint _taskId,
        address user
    ) public view returns (bool) {
        return taskUsersLinks[_taskId].contains(user);
    }

    function TotalUserCompletedByTask(uint _taskId) public view returns (uint) {
        return taskUsersLinks[_taskId].length();
    }

    function getUserCompletedTaskByIndex(
        uint _taskId,
        uint256 index
    ) public view returns (address) {
        require(
            index < taskUsersLinks[_taskId].length(),
            "Index out of bounds"
        );
        return taskUsersLinks[_taskId].at(index);
    }
}
