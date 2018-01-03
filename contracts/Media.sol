pragma solidity ^0.4.18;

contract Media {
    mapping (address => string) private mediaList;
    address public owner;

    event MediaChange(
      address indexed _from,
      string mediaList
    );

    function Media() public {
      owner = msg.sender;
    }

    /* Functions */
    function change(string updated) public {
      mediaList[msg.sender] = updated;
      MediaChange(msg.sender, mediaList[msg.sender]);
    }

    function getMedia(address addr) public  constant returns (string) {
      return mediaList[addr];
    }
}
