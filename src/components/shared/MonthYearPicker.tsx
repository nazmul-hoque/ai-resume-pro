import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MonthYearPickerProps {
    value?: string; // Format: YYYY-MM
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const MonthYearPicker = ({
    value,
    onChange,
    disabled,
    placeholder = "Select Date",
    className,
}: MonthYearPickerProps) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

    // Parse initial value or use defaults
    const [selectedYear, setSelectedYear] = React.useState<string>(
        value ? value.split("-")[0] : currentYear.toString()
    );
    const [selectedMonth, setSelectedMonth] = React.useState<string>(
        value ? (parseInt(value.split("-")[1]) - 1).toString() : new Date().getMonth().toString()
    );

    React.useEffect(() => {
        if (value) {
            const [y, m] = value.split("-");
            setSelectedYear(y);
            setSelectedMonth((parseInt(m) - 1).toString());
        }
    }, [value]);

    const handleDateChange = (year: string, month: string) => {
        const monthNum = parseInt(month) + 1;
        const formattedMonth = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
        const newValue = `${year}-${formattedMonth}`;
        onChange?.(newValue);
    };

    const displayDate = React.useMemo(() => {
        if (!value) return null;
        try {
            const date = parse(value, "yyyy-MM", new Date());
            return format(date, "MMM yyyy");
        } catch (e) {
            return value;
        }
    }, [value]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal h-10 px-3",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {displayDate || <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4" align="start">
                <div className="flex gap-2">
                    <Select
                        value={selectedMonth}
                        onValueChange={(val) => {
                            setSelectedMonth(val);
                            handleDateChange(selectedYear, val);
                        }}
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month, index) => (
                                <SelectItem key={month} value={index.toString()}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedYear}
                        onValueChange={(val) => {
                            setSelectedYear(val);
                            handleDateChange(val, selectedMonth);
                        }}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </PopoverContent>
        </Popover>
    );
};
