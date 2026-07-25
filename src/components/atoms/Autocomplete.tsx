/**
 * @file Autocomplete.tsx
 * @description MUI Autocomplete をラップした共通コンポーネント
 */
"use client";

import { forwardRef, useCallback, useMemo } from "react";
import type { HTMLAttributes, Key, MouseEvent, ReactNode, SyntheticEvent } from "react";
import {
    Autocomplete as MuiAutocomplete,
    Button,
    Checkbox,
    ListItemText,
} from "@mui/material";
import type {
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    AutocompleteProps as MuiAutocompleteProps,
    AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import { alpha, styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { Input } from "./Input";

/** オプションの型 */
export type AutocompleteOption = {
    /* 表示ラベル */
    label: string;
    /* 値 */
    value: string | number;
};

/** 単一選択の value（未選択 = null） */
export type AutocompleteSingleValue = string | number | null;

/** 複数選択の value（未選択 = []） */
export type AutocompleteMultipleValue = Array<string | number>;

/** onChange 共通シグネチャ */
type AutocompleteChangeHandler<TValue> = (
    event: SyntheticEvent,
    value: TValue,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<AutocompleteOption>,
) => void;

/** MUI から継承する共通部分 */
type AutocompleteSharedProps<TMultiple extends boolean> = Omit<
    MuiAutocompleteProps<AutocompleteOption, TMultiple, boolean, false>,
    | "options"
    | "value"
    | "defaultValue"
    | "onChange"
    | "multiple"
    | "freeSolo"
    | "renderInput"
    | "renderOption"
    | "isOptionEqualToValue"
    | "getOptionLabel"
    | "getOptionKey"
    | "disableCloseOnSelect"
> & {
    /* オプションの配列 */
    options: AutocompleteOption[];
    /* ラベル */
    label?: string;
    /* プレースホルダー */
    placeholder?: string;
    /* 無効化状態 */
    disabled?: boolean;
};

/** 単一選択の Props */
export type SingleAutocompleteProps = AutocompleteSharedProps<false> & {
    /* 複数選択モードかどうか */
    multiple?: false;
    /* 選択値 */
    value?: AutocompleteSingleValue;
    /* 非制御時の初期値 */
    defaultValue?: AutocompleteSingleValue;
    /* 選択値変更時のコールバック */
    onChange?: AutocompleteChangeHandler<AutocompleteSingleValue>;
};

/** 複数選択の Props */
export type MultipleAutocompleteProps = AutocompleteSharedProps<true> & {
    /* 複数選択モード */
    multiple: true;
    /* 選択値 */
    value?: AutocompleteMultipleValue;
    /* 非制御時の初期値 */
    defaultValue?: AutocompleteMultipleValue;
    /* 全選択ボタンのラベル */
    selectAllLabel?: string;
    /* 選択値変更時のコールバック */
    onChange?: AutocompleteChangeHandler<AutocompleteMultipleValue>;
};

/** 共通 Autocomplete の Props */
export type AutocompleteProps = SingleAutocompleteProps | MultipleAutocompleteProps;

/* Listbox コンポーネントの Props */
type ListboxComponentProps = HTMLAttributes<HTMLDivElement> & {
    /* 子要素 */
    children?: ReactNode;
    /* 全選択ボタンのクリックハンドラ */
    onSelectAll?: (event: MouseEvent<HTMLButtonElement>) => void;
    /* 全選択ボタンのラベル */
    selectAllLabel?: string;
    /* 全選択状態かどうか */
    allSelected?: boolean;
};

/* Autocomplete のルートスタイル */
const autocompleteRootStyles = ({ theme }: { theme: Theme }) => ({
    width: "100%",
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: alpha(theme.palette.common.white, 0.9),
        backdropFilter: "blur(10px)",
        transition: theme.transitions.create(["background-color", "box-shadow", "border-color"], {
            duration: 300,
        }),
        "& fieldset": {
            borderColor: theme.palette.grey[300],
        },
        "&:hover fieldset": {
            borderColor: theme.palette.grey[400],
        },
        "&.Mui-focused": {
            backgroundColor: theme.palette.common.white,
            boxShadow:
                `0 0 15px ${alpha(theme.palette.primary.main, 0.3)}, ` +
                `inset 0 0 10px ${alpha(theme.palette.primary.main, 0.1)}`,
            "& fieldset": {
                borderWidth: "1px",
                borderColor: theme.palette.primary.main,
            },
        },
    },
});

/* 単一選択 Autocomplete のスタイル */
const StyledSingleAutocomplete = styled(
    MuiAutocomplete<AutocompleteOption, false, boolean, false>,
)(autocompleteRootStyles);

/* 複数選択 Autocomplete のスタイル */
const StyledMultipleAutocomplete = styled(
    MuiAutocomplete<AutocompleteOption, true, boolean, false>,
)(autocompleteRootStyles);

/* ヘッダーの行 */
const HeaderRow = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-end",
    padding: `${theme.spacing(1)} ${theme.spacing(1)} 0`,
}));

/* ヘッダーのボタン */
const HeaderButton = styled(Button)(({ theme }) => ({
    minWidth: "auto",
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    textTransform: "none",
    fontWeight: 600,
    color: theme.palette.primary.main,
}));

/* リストボックスコンポーネント */
const ListboxComponent = forwardRef<HTMLDivElement, ListboxComponentProps>((
    { children, onSelectAll, selectAllLabel, allSelected, ...otherProps },
    ref,
) => {
    return (
        <div ref={ref} {...otherProps} role="listbox">
            {onSelectAll ? (
                <HeaderRow>
                    <HeaderButton
                        color="primary"
                        size="small"
                        variant="text"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={onSelectAll}
                    >
                        {allSelected ? "全解除" : selectAllLabel ?? "全選択"}
                    </HeaderButton>
                </HeaderRow>
            ) : null}
            {children}
        </div>
    );
});

/** MUI option 比較・表示の共通設定 */
const autocompleteOptionConfig = {
    /* option と selectedOption が等しいかどうかを判断する */
    isOptionEqualToValue: (option: AutocompleteOption, selectedOption: AutocompleteOption) =>
        option.value === selectedOption.value,
    /* option のラベルを取得する */
    getOptionLabel: (option: AutocompleteOption) => option.label,
    /* option のキーを取得する */
    getOptionKey: (option: AutocompleteOption) => option.value,
};

/* 単一選択で value に対応する option を取得する */
const toSelectedOption = (
    options: AutocompleteOption[],
    value: AutocompleteSingleValue | undefined,
): AutocompleteOption | null => {
    if (value === null || value === undefined) {
        return null;
    }

    const selectedOption = options.find((option) => option.value === value) ?? null;
    if (selectedOption === null) {
        warnUnknownSingleValue(value);
    }

    return selectedOption;
};

/* 複数選択で value に対応する option の配列を取得する */
const toSelectedOptions = (
    options: AutocompleteOption[],
    value: AutocompleteMultipleValue | undefined,
): AutocompleteOption[] => {
    if (!value?.length) {
        return [];
    }

    warnUnknownMultipleValues(options, value);

    const valueSet = new Set(value);
    return options.filter((option) => valueSet.has(option.value));
};

/* 単一選択で option を value に変換する */
const toSingleValue = (option: AutocompleteOption | null): AutocompleteSingleValue =>
    option?.value ?? null;

/* 複数選択で option の配列を value の配列に変換する */
const toMultipleValue = (options: AutocompleteOption[]): AutocompleteMultipleValue =>
    options.map((option) => option.value);

/* 単一選択で options に存在しない value が渡された場合に警告する */
const warnUnknownSingleValue = (value: string | number) => {
    if (process.env.NODE_ENV === "production") {
        return;
    }

    console.warn("[Autocomplete] unknown single value:", value);
};

/** 複数選択で options に存在しない value が渡された場合に警告する */
const warnUnknownMultipleValues = (
    options: AutocompleteOption[],
    value: AutocompleteMultipleValue,
) => {
    if (process.env.NODE_ENV === "production") {
        return;
    }

    const knownValues = new Set(options.map((option) => option.value));
    const unknownValues = value.filter((item) => !knownValues.has(item));
    if (unknownValues.length > 0) {
        console.warn("[Autocomplete] unknown multiple value(s):", unknownValues);
    }
};

/** 入力欄を描画する */
const renderAutocompleteInput = (
    params: AutocompleteRenderInputParams,
    label?: string,
    placeholder?: string,
    disabled?: boolean,
) => (
    <Input
        {...params}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
    />
);

/** 候補行を描画する */
const renderAutocompleteOption = (
    showCheckbox: boolean,
    renderProps: React.HTMLAttributes<HTMLLIElement> & { key: Key },
    option: AutocompleteOption,
    selected: boolean,
) => {
    const { key, ...optionProps } = renderProps;

    return (
        <li key={key} {...optionProps}>
            {showCheckbox ? <Checkbox checked={selected} disableRipple /> : null}
            <ListItemText primary={option.label} />
        </li>
    );
};

/** 単一選択 Autocomplete を表示する */
const AutocompleteSingle = (props: SingleAutocompleteProps) => {
    const {
        options,
        value,
        onChange,
        label,
        placeholder,
        disabled = false,
        defaultValue: _defaultValue,
        multiple: _multiple,
        ...restProps
    } = props;

    void _defaultValue;
    void _multiple;

    /* 単一選択で value に対応する option を取得する */
    const muiValue = toSelectedOption(options, value);

    /* 単一選択で value が変更された場合のコールバック */
    const handleChange: NonNullable<
        MuiAutocompleteProps<AutocompleteOption, false, boolean, false>["onChange"]
    > = (event, nextOption, reason, details) => {
        onChange?.(event, toSingleValue(nextOption), reason, details);
    };

    return (
        <StyledSingleAutocomplete
            {...restProps}
            {...autocompleteOptionConfig}
            options={options}
            value={muiValue}
            onChange={handleChange}
            multiple={false}
            disabled={disabled}
            renderInput={(params) => renderAutocompleteInput(params, label, placeholder, disabled)}
            renderOption={(renderProps, option, state) =>
                renderAutocompleteOption(false, renderProps, option, state.selected)
            }
            noOptionsText="候補がありません"
        />
    );
};

/** 複数選択 Autocomplete を表示する */
const AutocompleteMultiple = (props: MultipleAutocompleteProps) => {
    const {
        options,
        value,
        onChange,
        label,
        placeholder,
        selectAllLabel = "全選択",
        disabled = false,
        defaultValue: _defaultValue,
        multiple: _multiple,
        ...restProps
    } = props;

    void _defaultValue;
    void _multiple;

    /* 複数選択で value に対応する option の配列を取得する */
    const muiValue = toSelectedOptions(options, value);
    /* 全選択状態かどうかを判断する */
    const isAllSelected = options.length > 0 && muiValue.length === options.length;

    /* 複数選択で value が変更された場合のコールバック */
    const handleChange: NonNullable<
        MuiAutocompleteProps<AutocompleteOption, true, boolean, false>["onChange"]
    > = (event, nextOptions, reason, details) => {
        const nextValue = Array.isArray(nextOptions) ? nextOptions : [];
        onChange?.(event, toMultipleValue(nextValue), reason, details);
    };

    /* 全選択ボタンのクリックハンドラ */
    const handleSelectAll = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const nextValues = isAllSelected ? [] : toMultipleValue(options);
            const reason: AutocompleteChangeReason = isAllSelected ? "clear" : "selectOption";
            onChange?.(event, nextValues, reason);
        },
        [isAllSelected, onChange, options],
    );

    /* 複数選択でリストボックスを描画する */
    const MultipleListbox = useMemo(() => {
        const SelectAllListbox = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
            function SelectAllListbox(listboxProps, ref) {
                return (
                    <ListboxComponent
                        ref={ref}
                        onSelectAll={handleSelectAll}
                        selectAllLabel={selectAllLabel}
                        allSelected={isAllSelected}
                        {...listboxProps}
                    />
                );
            },
        );

        return SelectAllListbox;
    }, [handleSelectAll, isAllSelected, selectAllLabel]);

    return (
        <StyledMultipleAutocomplete
            {...restProps}
            {...autocompleteOptionConfig}
            options={options}
            value={muiValue}
            onChange={handleChange}
            multiple
            disableCloseOnSelect
            disabled={disabled}
            renderInput={(params) => renderAutocompleteInput(params, label, placeholder, disabled)}
            renderOption={(renderProps, option, state) =>
                renderAutocompleteOption(true, renderProps, option, state.selected)
            }
            slots={{ listbox: MultipleListbox }}
            noOptionsText="候補がありません"
        />
    );
};

/**
 * 共通 Autocomplete コンポーネントを表示する
 * @param props 表示に必要なプロパティ
 * @returns 共通 Autocomplete UI
 */
export const Autocomplete = (props: AutocompleteProps) => {
    if (props.multiple) {
        return <AutocompleteMultiple {...props} />;
    }

    return <AutocompleteSingle {...props} />;
};
