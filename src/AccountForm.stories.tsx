import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { Button, TextField } from "@bigtest/interactor";
import { AccountForm, AccountFormProps } from "./AccountForm";

export default {
  component: AccountForm,
  parameters: {
    layout: "centered",
  },
} as ComponentMeta<typeof AccountForm>;

// export const Standard = (args: AccountFormProps) => <AccountForm {...args} />;
// Standard.args = { passwordVerification: false };

export const Standard: ComponentStory<typeof AccountForm> = {
  // render: (args: AccountFormProps) => <AccountForm {...args} />,
  args: { passwordVerification: false },
};

export const StandardEmailFilled = {
  ...Standard,
  play: () => TextField("Email").fillIn("michael@chromatic.com"),
};

export const StandardEmailFailed = {
  ...Standard,
  play: async () => {
    await TextField("Email").fillIn("michael@chromatic.com.com@com");
    await TextField("Password").fillIn("testpasswordthatwontfail");
    await Button("Create Account".toUpperCase()).click();
  },
};

export const StandardPasswordFailed = {
  ...Standard,
  play: async () => {
    await StandardEmailFilled.play();
    await TextField("Password").fillIn("asdf");
    await Button("Create Account".toUpperCase()).click();
  },
};

export const StandardFailHover = {
  ...StandardPasswordFailed,
  play: async () => {
    await StandardPasswordFailed.play();
    // TODO Interactors don't have `hover` action
    await userEvent.hover(screen.getByTestId("password-error-info"));
  },
};

export const Verification: ComponentStory<typeof AccountForm> = {
  args: { passwordVerification: true },
};

export const VerificationPasssword1 = {
  ...Verification,
  play: async () => {
    await StandardEmailFilled.play();
    await TextField("Password").fillIn("asdfasdf");
    await Button("Create Account".toUpperCase()).click();
  },
};

export const VerificationPasswordMismatch = {
  ...Verification,
  play: async () => {
    await StandardEmailFilled.play();
    await TextField("Password").fillIn("asdfasdf");
    await TextField("Verify Password").fillIn("asdf1234");
    await Button("Create Account".toUpperCase()).click();
  },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// TODO Interactors don't have delay option for `fillIn`
export const VerificationSuccess = {
  ...Verification,
  play: async () => {
    await StandardEmailFilled.play();
    await sleep(1000);
    await TextField("Password").fillIn("asdfasdf");
    await sleep(1000);
    await TextField("Verify Password").fillIn("asdfasdf");
    await sleep(1000);
    await Button("Create Account".toUpperCase()).click();
  },
};
