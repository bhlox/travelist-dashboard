import { useTheme } from "next-themes";
import React from "react";
import PhoneInput, { PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CustomPhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    return (
      <PhoneInput
        inputStyle={{
          background: resolvedTheme === "dark" ? "black" : "white",
        }}
        buttonStyle={{
          background: resolvedTheme === "dark" ? "black" : "white",
        }}
        containerStyle={{
          background: resolvedTheme === "dark" ? "black" : "white",
        }}
        {...props}
      />
    );
  }
);

CustomPhoneInput.displayName = "PhoneInput";

export default CustomPhoneInput;
