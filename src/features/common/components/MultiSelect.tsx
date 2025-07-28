import * as React from "react";
import { ComponentProps } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
// import Image from "next/image";
// import picLoader from "@/../public/assets/images/loader.gif";
import { cn } from "@/lib/utils";

export type MultiSelectAction = "add" | "remove";

export function MultiSelect<T>({
  options,
  getIdentifier,
  getLabel,
  isLoading,
  placeholder,
  inputValue,
  setInputValue,
  values,
  handleUpdateValues,
  disabled,
  inputDisabled,
  className,
  ...props
}: {
  options: T[];
  getIdentifier: (option: T) => any;
  getLabel: (option: T) => string;
  isLoading?: boolean;
  placeholder?: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  values: T[];
  handleUpdateValues: (
    updatedValues: T[],
    value: T,
    action?: MultiSelectAction,
  ) => void;
  disabled?: boolean;
  inputDisabled?: boolean;
} & ComponentProps<typeof Command>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleRemove = React.useCallback(
    (e: any, option: T) => {
      e.preventDefault();
      e.stopPropagation();
      const updatedValues = values.filter(
        (s) => getIdentifier(s) !== getIdentifier(option),
      );
      handleUpdateValues(updatedValues, option, "remove");
    },
    [values],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const updatedValues = [...values];
            const removedValue = updatedValues.pop();

            if (removedValue)
              handleUpdateValues(updatedValues, removedValue, "remove");
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [values],
  );

  const selectables = options.filter(
    (option) => !values.find((s) => getIdentifier(s) === getIdentifier(option)),
  );

  return (
    <Command
      className={`overflow-visible bg-transparent ${disabled && "pointer-events-none"}`}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div
        className={`group border border-input px-3 py-2 text-sm ring-offset-background rounded-md ${
          !disabled &&
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        }`}
      >
        <div className="flex gap-1 flex-wrap">
          {values.map((option) => {
            return (
              <Badge
                className="font-normal text-md !py-3 !px-2"
                key={getIdentifier(option)}
                variant="outline"
              >
                {getLabel(option)}
                <button
                  className={`ml-1 ring-offset-background rounded-full outline-none ${
                    !disabled &&
                    "focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  }`}
                  onClick={(e) => handleRemove(e, option)}
                  onMouseDown={(e) => handleRemove(e, option)}
                  type="button"
                >
                  <X className="size-4 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            disabled={disabled || inputDisabled}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onValueChange={setInputValue}
            placeholder={placeholder}
            ref={inputRef}
            value={inputValue}
          />
          {/*<Image*/}
          {/*  alt="Loading..."*/}
          {/*  className={`w-6 h-6 -m-1 ${!isLoading && "invisible"}`}*/}
          {/*  priority*/}
          {/*  src={picLoader}*/}
          {/*/>*/}
          TODO loading
        </div>
      </div>
      <div className={cn("relative", className)}>
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="max-h-[20rem] overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    className="cursor-pointer"
                    disabled={disabled}
                    key={getIdentifier(option)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={(value) => {
                      setInputValue("");
                      handleUpdateValues([...values, option], option, "add");
                    }}
                  >
                    {getLabel(option)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
