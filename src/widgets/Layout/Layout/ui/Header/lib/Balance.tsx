import { NumericFormat } from "react-number-format";
import { cn } from "shared/lib/utils";

interface PriceFormat_BasicProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  prefix?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
  decimalScale?: number;
}

const Balance: React.FC<PriceFormat_BasicProps> = ({
  className,
  decimalScale = 2,
  decimalSeparator = ",",
  prefix = "$",
  thousandSeparator = ".",
  value,
}) => {
  return (
    <NumericFormat
      value={value}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      decimalScale={decimalScale}
      prefix={prefix}
      displayType="text"
      className={cn("text-lg font-medium", className)}
    />
  );
};

export default Balance;
