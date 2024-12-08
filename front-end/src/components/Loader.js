import {Oval} from 'react-loader-spinner'


export const Loader = ({children, isLoading, size = 80}) => {

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <Oval
                    height={size}
                    width={size}
                    color={"rgb(8,145,178)"}
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="white"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                />
            </div>
        )
    }

    return <>{children}</>;
};
