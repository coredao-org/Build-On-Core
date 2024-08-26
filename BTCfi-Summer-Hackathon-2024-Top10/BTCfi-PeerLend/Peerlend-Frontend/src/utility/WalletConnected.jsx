import { Avatar, Identity, Name, Badge, Address } from '@coinbase/onchainkit/identity';

const WalletConnected = ({ address, icon }) => {
    return( 
    <Identity className='bg-transparent' address={address} schemaId={'0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9'}>
       <Avatar src={icon} alt='icon'> 
            <Badge className="bg-error" />
        </Avatar>
        <Name className="text-black" />
        <Address className="text-white font-bold"/>
    </Identity>
    )
}
WalletConnected.propTypes = {
    address: String,
    icon: String
}

export default WalletConnected;