pragma solidity ^0.4.0;
contract Pravda {
    struct Metadata {
        uint8 score;
    }
    
    struct Article{
        Metadata metadata;
        bool exists;
    }
    
    mapping(uint256 => Article) public articles;

    /// add article
    function create(uint256 hash) public {
        articles[hash].exists = true;
    }
}
