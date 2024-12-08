import * as React from 'react';
import {cn} from "../lib/utils";


const Table = React.forwardRef(
    ({className, ...props}, ref) => <table ref={ref} className={cn('w-full', className)} {...props} />
);
Table.displayName = 'Table';

const TableBody = React.forwardRef(
    ({className, ...props}, ref) => (
        <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
    )
);
TableBody.displayName = 'TableBody';

const TableCaption = React.forwardRef(
    ({className, ...props}, ref) => (
        <caption ref={ref} className={cn('mt-4 text-sm text-slate-500 dark:text-slate-400', className)} {...props} />
    )
);
TableCaption.displayName = 'TableCaption';

const TableCell = React.forwardRef(
    ({className, ...props}, ref) => (
        <td ref={ref} className={cn('px-2 py-4 cursor-default text-center', className)} {...props} />
    )
);
TableCell.displayName = 'TableCell';

const TableFooter = React.forwardRef(
    ({className, ...props}, ref) => (
        <tfoot
            ref={ref}
            className={cn('border-t bg-slate-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-slate-800/50', className)}
            {...props}
        />
    )
);
TableFooter.displayName = 'TableFooter';

const TableHead = React.forwardRef(
    ({className, ...props}, ref) => (
        <th ref={ref} className={cn('h-10 cursor-default text-left align-middle', className)} {...props} />
    )
);
TableHead.displayName = 'TableHead';

const TableHeader = React.forwardRef(
    ({className, ...props}, ref) => <thead ref={ref} className={cn('sticky bg-white top-0', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableRow = React.forwardRef(
    ({className, ...props}, ref) => (
        <tr ref={ref} className={cn('border-b border-t border-black/50 hover:bg-primary/20', className)} {...props} />
    )
);
TableRow.displayName = 'TableRow';

export {Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow};
