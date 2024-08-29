import { update, text, ic, None, Record } from 'azle';
import { encodePubkey, makeSignBytes } from "@cosmjs/proto-signing";
const crypto = require('crypto');
const { bech32 } = require('bech32');
import { managementCanister } from 'azle/canisters/management';
import { fromHex, toBase64, toHex } from "@cosmjs/encoding";
import {ethers} from 'ethers'
import { getAddressAkashFromEVM, getEcdsaPublicKeyBase64FromEVM } from './get_address_akash';
import { createCertificateAkash } from './certificate';
const yamlObj = `
`

const User = Record({
    id: text, // evm address
    akashAddress: text, // the akash address
    akashPubEncod: text,
    akashCertpem: text, // akash certificate - base64
});

type User = typeof User.tsType;

type Db = {
    users: {
        [id: string]: User;
    };
};

let db: Db = {
    users: {}
};

// certPem and certPubpem as base64
export const updateAkashAddress = update([text, text, text], User, async (certPem: string, certPubpem: string, signatureHex: string) => {
    const message = 'update-akash-address' + certPem + certPubpem
    const messageHash = ethers.hashMessage(message); // Updated to v6
    const recoveredAddress = ethers.recoverAddress(messageHash, signatureHex); // Updated to v6
    console.log('the address recovered:')
    console.log(recoveredAddress)

    // const userExist = db.users[recoveredAddress];

    console.log('user do not exist, creating akash address')
    const akashAddress = await getAddressAkashFromEVM(recoveredAddress)
    const pubEncod = await getEcdsaPublicKeyBase64FromEVM(recoveredAddress)
    await createCertificateAkash(akashAddress, String(pubEncod), certPem, certPubpem)
    const user: User = {
        id: recoveredAddress,
        akashAddress: akashAddress,
        akashPubEncod: String(pubEncod),
        akashCertpem: certPem,
    };

    db.users[recoveredAddress] = user;
    return user;
});

