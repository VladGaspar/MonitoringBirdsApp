import {TableHead} from "../@/components/ui/table";
import {cn} from "../utils/tailwindMerge";

const TableHeaderItem = ({textId, sortable, onSort}) => {
    const sortHoverOptions = ' hover:cursor-pointer hover:bg-primary/50 transition ease-in-out duration-300';

    return (
        <TableHead onClick={onSort} className={cn('p-2 rounded-lg ', sortable ? sortHoverOptions : undefined)}>
            <div className="flex justify-center items-baseline space-x-2">
                <span>{textId}</span>
            </div>
        </TableHead>
    );
};

export default TableHeaderItem;
