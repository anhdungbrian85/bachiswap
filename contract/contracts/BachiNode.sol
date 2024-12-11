// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BachiNode is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    AccessControl,
    Ownable
{
    address public nodeManagerAddress;
    uint256 public lastTokenId;

    constructor(
        string memory name,
        string memory symbol,
        address _nodeManagerAddress
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        nodeManagerAddress = _nodeManagerAddress;
    }

    modifier onlyNodeManager() {
        require(
            nodeManagerAddress == msg.sender,
            "Unauthorized: Only node manager"
        );
        _;
    }

    function setNodeManagerAddress(address newAddress) public onlyOwner {
        nodeManagerAddress = newAddress;
    }

    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) public onlyNodeManager {
        lastTokenId = tokenId;
        _safeMint(to, lastTokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
