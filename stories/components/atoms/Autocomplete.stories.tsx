/**
 * @file Autocomplete.stories.tsx
 * @description Autocomplete コンポーネントの表示確認用ストーリー。
 */
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Autocomplete,
  type AutocompleteMultipleValue,
  type AutocompleteProps,
  type AutocompleteSingleValue,
} from "@/src/components/atoms/Autocomplete";

const options = [
  { label: "受付番号 001", value: "001" },
  { label: "受付番号 002", value: "002" },
  { label: "受付番号 003", value: "003" },
];

const meta: Meta<typeof Autocomplete> = {
  title: "Components/Atoms/Autocomplete",
  component: Autocomplete,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: "対象を選択",
    options,
    placeholder: "選択してください",
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

/**
 * Single: 単一選択モードの表示
 */
export const Single: Story = {
  render: (args: AutocompleteProps) => {
    const [value, setValue] = useState<AutocompleteSingleValue>(null);

    if (args.multiple) {
      return <></>;
    }

    return (
      <Autocomplete
        {...args}
        multiple={false}
        value={value}
        onChange={(_, nextValue: AutocompleteSingleValue) => setValue(nextValue)}
      />
    );
  },
};

/**
 * SinglePreselected: 初期値ありの単一選択
 */
export const SinglePreselected: Story = {
  render: (args: AutocompleteProps) => {
    const [value, setValue] = useState<AutocompleteSingleValue>("002");

    if (args.multiple) {
      return <></>;
    }

    return (
      <Autocomplete
        {...args}
        multiple={false}
        value={value}
        onChange={(_, nextValue: AutocompleteSingleValue) => setValue(nextValue)}
      />
    );
  },
};

/**
 * Multiple: 複数選択モードの表示
 */
export const Multiple: Story = {
  args: {
    multiple: true,
    label: "対象を複数選択",
    placeholder: "複数選択できます",
  },
  render: (args: AutocompleteProps) => {
    const [value, setValue] = useState<AutocompleteMultipleValue>([]);

    if (!args.multiple) {
      return <></>;
    }

    return (
      <Autocomplete
        {...args}
        multiple
        value={value}
        onChange={(_, nextValue: AutocompleteMultipleValue) => setValue(nextValue)}
      />
    );
  },
};

/**
 * MultipleSelectAll: 全選択・全解除ボタンの動作確認
 */
export const MultipleSelectAll: Story = {
  args: {
    multiple: true,
    label: "全選択ボタン付き",
    placeholder: "複数選択できます",
    selectAllLabel: "すべて選ぶ",
  },
  render: (args: AutocompleteProps) => {
    const [value, setValue] = useState<AutocompleteMultipleValue>(["001"]);

    if (!args.multiple) {
      return <></>;
    }

    return (
      <Autocomplete
        {...args}
        multiple
        value={value}
        onChange={(_, nextValue: AutocompleteMultipleValue) => setValue(nextValue)}
      />
    );
  },
};

/**
 * MultiplePartialSelection: 部分選択時の全選択ボタン表示
 */
export const MultiplePartialSelection: Story = {
  args: {
    multiple: true,
    label: "部分選択",
    placeholder: "複数選択できます",
  },
  render: (args: AutocompleteProps) => {
    const [value, setValue] = useState<AutocompleteMultipleValue>(["001", "002"]);

    if (!args.multiple) {
      return <></>;
    }

    return (
      <Autocomplete
        {...args}
        multiple
        value={value}
        onChange={(_, nextValue: AutocompleteMultipleValue) => setValue(nextValue)}
      />
    );
  },
};
