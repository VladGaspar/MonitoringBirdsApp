import clsx from 'clsx';


export const Button = ({type, textButton, onClick, children, ...props}) => {
    const baseClasses = 'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline';
    const normalBtnClasses = 'bg-cyan-600 text-white hover:bg-cyan-800 hover:text-white';
    const textBtnClasses = 'bg-gray-300 text-primary hover:bg-gray-500 hover:text-black';
    const disabled = 'bg-slate-400';

    const classes = clsx({
        [baseClasses]: true,
        [textBtnClasses]: textButton,
        [normalBtnClasses]: !textButton,
        [disabled]: props.disabled,
    });

    return (
        <button type={type} onClick={onClick} className={classes} {...props}>
            {children}
        </button>
    );
};
