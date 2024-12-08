import {useSearchParams} from 'react-router-dom';

export const ErrorDisplay = () => {
    const [searchParams] = useSearchParams();
    const errorCode = searchParams.get('errorCode');
    const title = 'errorPage.title';
    const text = errorCode ? `${errorCode} - ${title}` : title;
    return (
        <div className="w-full h-full">
            <div
                className="flex flex-col items-center m-auto mt-32 w-[60%] h-auto bg-white drop-shadow-2xl rounded-2xl">
                <h2 className="font-bold text-5xl m-20">{text}</h2>
                <h2 className="text-2xl">{'errorPage.text'}</h2>
                <ul className="text-lg italic mt-4 mb-12 list-disc">
                </ul>
            </div>
        </div>
    );
};
