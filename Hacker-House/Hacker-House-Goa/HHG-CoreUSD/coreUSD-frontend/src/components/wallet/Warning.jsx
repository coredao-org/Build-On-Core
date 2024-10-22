/* eslint-disable react/prop-types */
import {
  Box,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@interchain-ui/react";

export const WarningIcon = <Icon name="errorWarningLine" size="$lg" />;

export function Warning({ text, icon = WarningIcon }) {
  return (
    <Box
      p="$6"
      borderRadius="$md"
      backgroundColor={useColorModeValue("$orange200", "$orange300")}
    >
      <Stack>
        <Box mt="$2">{icon}</Box>
        <Box flex="1" ml="$4" maxHeight="$24" overflow="scroll">
          <Text
            color={useColorModeValue("$gray700", "$gray800")}
            fontSize="$sm"
            fontWeight="$medium"
            lineHeight="$tall"
          >
            {text}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
