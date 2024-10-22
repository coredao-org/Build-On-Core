/* eslint-disable react/prop-types */
import { Button as UIButton } from "@interchain-ui/react";
// import Button from "../Button";

function noop() {}

export function Button({ text, icon, loading, disabled, onClick = noop }) {
  return (
    <UIButton
      onClick={onClick}
      leftIcon={icon}
      disabled={disabled}
      isLoading={loading}
      domAttributes={{
        style: {
          flex: 1,
          backgroundImage:
            "linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)",
        },
      }}
    >
      {text}
    </UIButton>
  );
}

export const ButtonConnect = ({ text = "Connect Wallet", onClick = noop }) => (
  <Button text={text} icon="walletFilled" onClick={onClick} />
);

export const ButtonConnected = ({ text = "My Wallet", onClick = noop }) => (
  <Button text={text} icon="walletFilled" onClick={onClick} />
);

export const ButtonDisconnected = ({
  text = "Connect Wallet",
  onClick = noop,
}) => <Button text={text} icon="walletFilled" onClick={onClick} />;

export const ButtonConnecting = ({
  text = "Connecting ...",
  loading = true,
}) => <Button text={text} loading={loading} />;

export const ButtonRejected = ({ text = "Reconnect", onClick = noop }) => (
  <Button text={text} icon="walletFilled" onClick={onClick} />
);

export const ButtonError = ({ text = "Change Wallet", onClick = noop }) => (
  <Button text={text} icon="walletFilled" onClick={onClick} />
);

export const ButtonNotExist = ({ text = "Install Wallet", onClick = noop }) => (
  <Button text={text} icon="walletFilled" onClick={onClick} />
);
