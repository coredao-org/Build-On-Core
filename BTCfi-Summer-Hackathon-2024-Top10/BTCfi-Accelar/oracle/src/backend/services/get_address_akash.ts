import { update, text, ic, None } from 'azle';
import { encodePubkey, makeSignBytes } from "@cosmjs/proto-signing";
const crypto = require('crypto');
const { bech32 } = require('bech32');
import { managementCanister } from 'azle/canisters/management';
import { fromHex, toBase64, toHex } from "@cosmjs/encoding";

const yamlObj = `
`

// Função para preparar uma mensagem de transação
export const getAkashAddress = update([text], text, async (ethereumAddress: string) => {
    return await getAddressAkashFromEVM(ethereumAddress)
  })

export async function getAddressAkash() {
const publicKeyResult = await ic.call(
    managementCanister.ecdsa_public_key,
    {
        args: [
            {
                canister_id: None,
                derivation_path: [],
                key_id: {
                    curve: { secp256k1: null },
                    name: 'dfx_test_key'
                }
            }
        ]
    }
);

console.log(publicKeyResult)

const publicKeyBuffer = Buffer.from(publicKeyResult.public_key);

const publicKey = publicKeyResult.public_key; // This will be a Uint8Array
console.log('Public Key:', Buffer.from(publicKey).toString('hex'));

console.log('buffer pk')
console.log(publicKeyBuffer)

// Realiza o hash da chave pública usando SHA256
const sha256Hash = crypto.createHash('sha256').update(publicKeyBuffer).digest();

console.log('sha hash')
console.log(sha256Hash)

// Realiza um segundo hash usando RIPEMD160
const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();

// Converte o resultado para o formato de endereço Bech32
const cosmosAddress = bech32.encode('akash', bech32.toWords(ripemd160Hash));

return cosmosAddress;
}

export async function getDerivationPathFromAddressEVM(ethereumAddress: string) {
    // const caller = ic.caller().toUint8Array();
    const hashedEthAddress = crypto.createHash('sha256').update(ethereumAddress).digest();

    // Converte o hash para Uint8Array
    const hashedEthAddressArray = new Uint8Array(hashedEthAddress);

    // Usa o hash do endereço Ethereum como parte do caminho de derivação
    const derivationPath = hashedEthAddressArray;
    return derivationPath
}

export async function getAddressAkashFromEVM(ethereumAddress: string) {
    // const caller = ic.caller().toUint8Array();
    const hashedEthAddress = crypto.createHash('sha256').update(ethereumAddress).digest();

    // Converte o hash para Uint8Array
    const hashedEthAddressArray = new Uint8Array(hashedEthAddress);

    // Usa o hash do endereço Ethereum como parte do caminho de derivação
    const derivationPath = [hashedEthAddressArray];
    

    const publicKeyResult = await ic.call(
        managementCanister.ecdsa_public_key,
        {
            args: [
                {
                    canister_id: None,
                    derivation_path: derivationPath,
                    key_id: {
                        curve: { secp256k1: null },
                        name: 'dfx_test_key'
                    }
                }
            ]
        }
    );

    console.log(publicKeyResult)

    const publicKeyBuffer = Buffer.from(publicKeyResult.public_key);

    const publicKey = publicKeyResult.public_key; // This will be a Uint8Array
    console.log('Public Key:', Buffer.from(publicKey).toString('hex'));

    console.log('buffer pk')
    console.log(publicKeyBuffer)

    // Realiza o hash da chave pública usando SHA256
    const sha256Hash = crypto.createHash('sha256').update(publicKeyBuffer).digest();

    console.log('sha hash')
    console.log(sha256Hash)

    // Realiza um segundo hash usando RIPEMD160
    const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();

    // Converte o resultado para o formato de endereço Bech32
    const cosmosAddress = bech32.encode('akash', bech32.toWords(ripemd160Hash));

    return cosmosAddress;
  }

  export async function getEcdsaPublicKeyBase64() {
    // Substitua 'None' e 'caller' por valores apropriados para o seu caso
    const publicKeyResult = await ic.call(
        managementCanister.ecdsa_public_key, {
            args: [
                {
                    canister_id: None,  // Substitua conforme a configuração necessária
                    derivation_path: [],  // Ajuste conforme necessário
                    key_id: {
                        curve: { secp256k1: null },
                        name: 'dfx_test_key'  // O nome do identificador da chave
                    }
                }
            ]
        }
    );

    // Assume que publicKeyResult retorna algo como { public_key: Uint8Array }
    if (publicKeyResult && publicKeyResult.public_key) {
        const publicKeyBytes = publicKeyResult.public_key;
        const base64PubKey = toBase64(publicKeyBytes);
        const encodedPubKey = encodePubkey({
          type: "tendermint/PubKeySecp256k1",
          value: base64PubKey,
        });
        return encodedPubKey;
    } else {
        throw new Error("Public key not retrieved successfully.");
    }
}

  export async function getEcdsaPublicKeyBase64FromEVM(ethereumAddress: string) {
    // Substitua 'None' e 'caller' por valores apropriados para o seu caso
    // const caller = ic.caller().toUint8Array();
    const hashedEthAddress = crypto.createHash('sha256').update(ethereumAddress).digest();

    // Converte o hash para Uint8Array
    const hashedEthAddressArray = new Uint8Array(hashedEthAddress);

    // Usa o hash do endereço Ethereum como parte do caminho de derivação
    const derivationPath = [hashedEthAddressArray];

    const publicKeyResult = await ic.call(
        managementCanister.ecdsa_public_key, {
            args: [
                {
                    canister_id: None,  // Substitua conforme a configuração necessária
                    derivation_path: derivationPath,  // Ajuste conforme necessário
                    key_id: {
                        curve: { secp256k1: null },
                        name: 'dfx_test_key'  // O nome do identificador da chave
                    }
                }
            ]
        }
    );

    // Assume que publicKeyResult retorna algo como { public_key: Uint8Array }
    if (publicKeyResult && publicKeyResult.public_key) {
        const publicKeyBytes = publicKeyResult.public_key;
        const base64PubKey = toBase64(publicKeyBytes);
        const encodedPubKey = encodePubkey({
          type: "tendermint/PubKeySecp256k1",
          value: base64PubKey,
        });
        return encodedPubKey;
    } else {
        throw new Error("Public key not retrieved successfully.");
    }
}
