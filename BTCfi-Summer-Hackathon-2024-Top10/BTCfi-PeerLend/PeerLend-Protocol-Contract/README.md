### PeerLend: Revolutionizing Decentralized P2P Lending and Borrowing

<img src="image/logo.jpeg" alt="peerlend Logo" />



## Inspiration

In the rapidly evolving world of decentralized finance (_DeFi_), platforms like **Aave** and **Compound** have paved the way for accessible borrowing and lending. However, these platforms often leave users feeling constrained. Borrowers are subjected to inflexible interest rates and limited options, while lenders lack the assurance of truly personalized engagements. **What if there was a way to revolutionize this space, giving users unprecedented control and flexibility over their financial transactions?** This question sparked the creation of **PeerLend**.

Imagine a borrower who needs a loan but can’t find the right terms. They’re forced to accept high-interest rates and rigid repayment plans. On the other hand, consider a lender looking for investment opportunities, yet unable to find borrowers who meet their specific criteria. The current DeFi landscape offers no solution for these issues.

**PeerLend** emerged from the desire to empower users to take control of their financial destinies. We envisioned a platform where borrowers can specify their exact needs and lenders can provide offers that match or partially match these requests. _This level of personalization and control is unprecedented in the DeFi space_, and it’s what makes **PeerLend** truly revolutionary. Our inspiration was driven by the need to create a more inclusive and user-centric financial ecosystem, where both parties can negotiate terms that suit them best, fostering a sense of trust and mutual benefit.

## What It Does

**PeerLend** is a groundbreaking platform that brings a new level of sophistication and user empowerment to the DeFi space. Here’s how:

- **Custom Loan Requests**: Unlike the rigid structures of Aave and Compound, **PeerLend** allows borrowers to create loan requests tailored to their specific needs. Borrowers can set their desired loan amount, interest rate, and repayment period.
- **Personalized Offers**: Lenders can review these requests and propose offers that fully or partially meet the borrower’s terms. This creates a dynamic marketplace where users can negotiate and find mutually beneficial agreements.
- **Smart Collateral Management**: To ensure financial safety, users can collateralize assets and manage multiple loan requests without exceeding 85% of their collateral value. This approach provides flexibility while maintaining security.
- **Automated Liquidation**: Leveraging **Chainlink automation**, **PeerLend** ensures that collateral liquidation is seamlessly triggered when necessary, protecting lenders and maintaining platform integrity.
- **Real-Time Email Notifications**: Integrated email services provide instant notifications for offers, requests, and important activities, keeping users informed and engaged.
- **Decentralized Governance**: A **DAO** enables users to vote on platform changes, ensuring that **PeerLend** evolves in line with the community’s needs and preferences.

## How We Built It

Building **PeerLend** required leveraging the latest technologies and integrating them into a seamless user experience. Here’s an overview of our tech stack and development process:

- **Solidity Smart Contracts**: We used _Solidity_ to write the smart contracts that handle loan requests, offers, and collateral management. These contracts ensure security and transparency in all transactions.
- **Chainlink Data Feeds**: To fetch real-time token price feeds, we integrated **Chainlink** data feeds, ensuring accurate collateral valuations and protecting users from market volatility.
- **Gitcoin Verification**: For KYC, we integrated **Gitcoin** verification to ensure users' on-chain presence and community trust.
- **Spring Boot Email Service**: We built an email service using _Spring Boot_, integrated with **Brevo** for sending OTP codes and notifications. User emails are stored in a **MySQL** database deployed on _Railway_, and the Spring Boot application is hosted on _Render_.
- **React Frontend**: Our frontend, developed in _React_, provides a sleek and intuitive user interface, making the platform accessible and user-friendly.
- **Chainlink Automation**: We used **Chainlink automation** for managing the liquidation process, ensuring collateral is automatically liquidated when the health factor drops below 1.
- **Gemini AI**: Integrated AI functionalities to personalize user experiences and generate content.
## System design
<img src="image/Screenshot from 2024-06-28 22-41-35.png" alt="PeerLend system design" />


## Challenges We Ran Into

Developing a cutting-edge platform like **PeerLend** came with its share of challenges. Here are some of the major hurdles we faced and how we overcame them:

- **External Adapter Integration**: We aimed to integrate **Chainlink external adapters** to send emails directly from smart contracts. This involved utilizing the Chainlink node operator backend in our smart contract to trigger our endpoint. Finding the right Chainlink node provider to host our adapter was challenging, but we successfully integrated the system with the help of the LinkWell node. By utilizing their backend adapter, we were able to trigger our endpoint without needing to host our own adapter, significantly enhancing our platform's functionality.
- **User Trust and Verification**: Balancing effective KYC with decentralization was complex. Our solution was to integrate **Gitcoin** for user verification, but we also recognized the need for continuous improvement in this area to enhance trust and security.
- **Real-Time Communication**: Ensuring real-time communication with users was vital. Integrating an efficient email service helped, but we plan to expand this with additional notification methods like SMS and in-app notifications.

## Accomplishments That We're Proud Of

Despite the challenges, we achieved several milestones that demonstrate the innovation and robustness of **PeerLend**:

- **Pioneering Loan Flexibility**: We successfully implemented a system that allows borrowers to create custom loan requests and receive tailored offers from lenders, setting us apart from traditional DeFi platforms.
- **Seamless Automated Liquidation**: Our integration of **Chainlink automation** ensures that collateral liquidation processes are efficient and reliable, protecting user assets.
- **Robust Email Integration**: By building a comprehensive email notification system, we have significantly improved user engagement and communication, ensuring that users are always informed about their transactions.

## What We Learned

Throughout the development of **PeerLend**, we gained valuable insights into the DeFi landscape and user needs:

- **Decentralized Governance**: Implementing a **DAO** for community-driven decision-making is crucial for building trust and engagement. It ensures that the platform evolves based on user feedback and needs.
- **Smart Contract Integration**: Combining multiple functionalities, such as price feeds and automation, in smart contracts can create powerful and user-centric DeFi solutions.
- **User Experience**: Providing clear, immediate communication through email integration significantly enhances user satisfaction and platform interaction. Users appreciate being informed and having control over their financial activities.

## What's Next for PeerLend

We have ambitious plans for the future of **PeerLend**, aiming to continuously innovate and improve the platform:

- **Broader Token Support**: We plan to expand the range of collateral tokens, offering users more options and flexibility.
- **Advanced KYC Solutions**: Implementing sophisticated KYC methods, such as zero-knowledge proofs, to enhance user privacy and security.
- **Enhanced Notification System**: Developing a more advanced notification system, including SMS and in-app notifications, to ensure users receive real-time updates.
- **Mobile Application**: Launching a mobile app to increase accessibility and user engagement, allowing users to manage their loans and offers on the go.
- **Community Rewards**: Introducing incentive programs for active participants, such as lenders, borrowers, and DAO members, to foster a vibrant and engaged community.
- **Revenue Generation**: Exploring revenue models like transaction fees, premium services, and strategic partnerships to ensure platform sustainability and growth.

## PeerLend: Revolutionizing Decentralized P2P Lending and Borrowing

<img src="image/WhatsApp Image 2024-06-28 at 10.46.29 PM.jpeg" alt="peerlend homepage" />

## Overview

Welcome to **PeerLend**, a robust web3 P2P lending and borrowing platform where users can verify their Gitcoin Passport, verify their email, deposit collateral, create loan requests, service loan requests, create loan offers, accept loan offers, reject loan offers, repay loans, and withdraw collateral.

## Features

- **Gitcoin Passport Verification**: Users can verify their on-chain presence and build trust within the community.
- **Email Verification**: Ensures user authenticity and secure communication.
- **Deposit Collateral**: Users can deposit various supported tokens as collateral.
- **Create Loan Requests**: Borrowers can specify their loan needs, including amount, interest rate, and repayment period.
- **Service Loan Requests**: Lenders can review and fulfill loan requests from borrowers.
- **Create Loan Offers**: Lenders can propose customized loan offers to borrowers.
- **Accept/Reject Loan Offers**: Borrowers have the flexibility to accept or reject loan offers based on their preferences.
- **Repay Loan**: Borrowers can repay their loans according to the agreed terms.
- **Withdraw Collateral**: After loan repayment, borrowers can withdraw their collateral.

## Tools

- **ReactJS**: Utilized for building the frontend, providing a dynamic and responsive user interface.
- **Foundry**: Used for testing and deploying smart contracts efficiently.
- **Java & Spring Boot**: Powering the backend services, including email verification and notification systems.
- **Render**: Hosting the Spring Boot application to ensure reliable service.
- **Railway MySQL**: Storing user data securely, such as email information for verification and notifications.
- **Gitcoin Passport**: Integrated for user verification, enhancing trust within the community.
- **Swagger Docs**: Providing API documentation for seamless integration and developer collaboration.
- **Solidity**: Writing smart contracts for managing loans, collateral, and other platform functionalities.
- **Brevo Mail**: Facilitating email services for OTP codes and notifications to keep users informed.
- **Gemini AI**: Integrated for AI-driven content generation.

By combining these advanced tools and features, **PeerLend** aims to deliver a user-centric, secure, and flexible

## Contract Address
- **$PEER address**: 0xA000EBb1395b34369F60e31986fF7432529016D0
- **Governance address**: 0x56009b32fc2eD604F53CA1C3f41e2cc414d72267
- **Proxy Address**: 0x8c453Aad3B6F4610260326ce3F78Bd869a25Ad69
- **Protocol address**: 0x516a8fc59c3afE12C085CbFe093B3c3A3bfFA691