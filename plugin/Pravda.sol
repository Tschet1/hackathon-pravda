pragma solidity ^0.4.14;

contract Pravda {
    
    struct Reporters {
        bool exists;
        address reporter;
        address validator;
    }
    
    mapping(uint256 => Reporters) public flaggedArticles;
    
    function flagAsFake(uint256 hash, address validatorAddr) payable public {
        
        if (flaggedArticles[hash].exists == false) {

            flaggedArticles[hash] = Reporters({
                exists: true,
                reporter: msg.sender,
                validator: validatorAddr
            });
        } 
    }
    
}
