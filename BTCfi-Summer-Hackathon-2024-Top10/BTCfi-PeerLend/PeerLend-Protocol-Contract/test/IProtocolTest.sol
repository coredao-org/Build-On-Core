// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

interface IProtocolTest {
    struct Request {
        address tokenAddr;
        address author;
        uint256 amount;
        uint8 interest;
        Offer[] offer;
        uint256 returnDate;
        Status status;
    }

    enum Status {
        OPEN,
        SERVICED,
        CLOSED
    }

    enum OfferStatus {
        OPEN,
        REJECTED,
        ACCEPTED
    }

    struct Offer {
        uint256 offerId;
        address tokenAddr;
        address author;
        uint256 amount;
        uint8 interest;
        uint256 returnDate;
        OfferStatus offerStatus;
    }
}
