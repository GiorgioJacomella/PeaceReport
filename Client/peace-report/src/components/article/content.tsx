import { IContentElement } from "@/src/api";

interface ContentProps {
    content: IContentElement[];
}

const Content: React.FC<ContentProps> = ({ content }) => {
    return (
        <div className="space-y-6">
            {content.map((element, index) => {
                if (element.type === "image") {
                    return (
                        <div className="flex justify-center" key={index}>
                            <img
                                src={element.value}
                                alt="Content image"
                                className="w-full md:w-3/4 lg:w-2/3 xl:w-2/3 rounded-md shadow-md"
                            />
                        </div>
                    );
                } else {
                    return (
                        <p key={index} className="text-lg leading-relaxed text-gray-800 md:w-3/4 lg:w-2/3 xl:w-2/3 mx-auto">
                            {element.value}
                        </p>
                    );
                }
            })}
        </div>
    );
}

export default Content;
