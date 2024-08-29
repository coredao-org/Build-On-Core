import styled, { css } from 'styled-components';


export const ItemBackground = styled.div`
        width: 100%;
        display: flex;
        justify-content: center;
        background-repeat: no-repeat;
        background-size: cover;
        margin-bottom: -50px;
        `;

export const ItemContainer = styled.div`
        margin-top: 30px;
        box-sizing: border-box;
        min-width: 320px;
        max-width: 560px;
        width: 100%;
        padding: 0px 32px;
        position: relative;
        `;

export const ItemTitle = styled.h3`
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

export const ItemSubTitle = styled.div`
        text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue;
        text-align: center;
        color: yellow;
        margin-bottom: 5px;
        `;

export const ItemHeader = styled.div`
        background: black;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.6em;
        border-radius: 20px;
        margin: 0px;
        padding: 20px;
        box-shadow: none;
        color: rgb(255, 255, 255);
        `;

export const ItemBody = styled.div`
        font-weight: 400;
        font-size: 1em;
        line-height: 1.6em;
        border-radius: 0px 0px 20px 20px;
        margin: -20px 0px 0px;
        padding-inline: 32px;
        padding-top: 32px;
        box-shadow: none;
        background: gray;
        color: black;
        `;

export const ItemMintNumber = styled.label`
        font-size: 20px;
        font-weight: 800;
        color: black;
        `;

export const ItemMintButton = styled.button`
        background: #f54866;
        color: white;
        font-weight: 700;
        padding: 15px 20px;
        border-radius: 1rem;
        border: none;
        margin-right: 10px;
        margin-left: 10px;
        &:hover {
            background: rgb(146 0 0);
        }
        `;