// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


// YfnooToken with Governance.
contract YFACool is ERC20("yfa.cool", "YFAC"), Ownable {
    /// @notice Creates `_amount` token to `_to`. Must only be called by the owner.
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    // Burn some yfac reduce total circulation.
    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }

}