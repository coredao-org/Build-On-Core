import styled, { css } from 'styled-components';

export const ItemBackground = styled.div`
        width: 100%;
        //height: 100vh;
        display: flex;
        justify-content: center;
        margin-bottom: -50px;
        //background-image: url('https://pin.ski/444ghZP');
        background-repeat: no-repeat;
        background-size: cover;
        `;

export const ItemContainer = styled.div`
        margin-top: 30px;
        box-sizing: border-box;
        min-width: 500px;
        max-width: 600px;
        width: 100%;
        padding: 0px 32px;
        position: relative;
        `;

export const ItemTitle = styled.h3`
        font-weight: 900;
        text-align: center;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
        `;

export const ItemImage = styled.img`
            width: 40px;
            margin-right: 15px;
        `;

export const ItemHeader = styled.div`
        background: #64473f;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.6em;
        border-radius: 20px;
        margin: 0px;
        padding: 20px;
        box-shadow: none;
        color: rgb(255, 255, 255);
        `;

export const ItemBodySelect = styled.div`
        font-weight: 400;
        font-size: 1em;
        line-height: 1.6em;
        border-radius: 0px 0px 20px 20px;
        margin: -20px 0px 0px;
        padding-inline: 10px;
        box-shadow: none;
        background-image: url('https://raw.githubusercontent.com/yaairnaavaa/Burrito-Virtual-Pet/main/background.png');
        background-repeat: no-repeat;
        background-size: cover;        
        color: #feb75b;
        min-height: 500px;
        max-height: auto;
        border: solid 5px;
        `;

export const ItemBodyPlay = styled.div`
        font-weight: 400;
        font-size: 1em;
        line-height: 1.6em;
        border-radius: 0px 0px 20px 20px;
        margin: -20px 0px 0px;
        padding-inline: 10px;
        box-shadow: none;
        background-image: url('https://raw.githubusercontent.com/yaairnaavaa/Burrito-Virtual-Pet/main/backgorund-play.png');
        background-repeat: no-repeat;
        background-size: cover;        
        color: #feb75b;
        min-height: 500px;
        max-height: auto;
        border: solid 5px;
        `;

export const ItemPetsSection = styled.div`
        min-height: 500px;
        max-height: 550px;
        align-content: end;
        `;

export const ItemPet = styled.div`
    display: flex !important;
    width: 100%;
    display: flex !important;
    justify-content: center;
    cursor: pointer;
  `;

export const ItemPetAction = styled.div`
    gap: 0.25rem !important;
    padding: 1rem !important;
    flex-direction: column !important;
    display: flex !important;
    border: solid 3px;
    border-radius: 20px;
    color: black;
    background: rgb(0 0 0 / 40%);
    align-items: center;
    cursor: pointer;
  `;

export const ItemPetImg = styled.img`
    height: 400px;
    width: 400px;
  `;

export const ItemMintButton = styled.button`
        background: #f54866;
        color: white;
        font-weight: 700;
        padding: 10px 15px;
        border-radius: 1rem;
        border: none;
        font-size: 14px;
        &:hover {
            background: rgb(146 0 0);
        }
        `;

export const SquareButton = styled.button`
        background: #fff;
        border: 1px solid black;
        float: left;
        font-size: 24px;
        line-height: 34px;
        height: 50px;
        margin-right: -1px;
        margin-top: -1px;
        padding: 0;
        text-align: center;
        width: 50px;
      `;