import { useState, useRef, RefObject, useEffect } from "react";

import Typography from "./Typography";

import { AiFillCloseCircle } from "react-icons/ai";
import { useSuggestionArr } from "@hook/useSuggestionArr";

type IAutoCompletionTags = {
    selectedTags: Array<string>;
    defaultSuggestions: Array<string>;
    setSelectedTags: (tags: Array<string>) => void;
};

function AutoCompletionTags({ selectedTags, defaultSuggestions, setSelectedTags }: IAutoCompletionTags) {
    const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const [isDropDownShow, setIsDropDownShow] = useState(false);
    const [text, setText] = useState<string>("");

    const { suggestions } = useSuggestionArr({ text, selectedTags, defaultSuggestions });

    const selectSuggestion = (value: string) => {
        setSelectedTags([...selectedTags, value]);
        setText("");
    };

    const filterSuggestion = (value: string) => {
        setSelectedTags([...selectedTags].filter((v) => v !== value));
    };

    useEffect(() => {
        const outsideClick = (e: MouseEvent) => {
            if (isDropDownShow && !dropdownRef.current?.contains(e.target as Node)) {
                setIsDropDownShow(false);
            }
        };

        document.body.addEventListener("click", outsideClick);

        return () => {
            document.body.removeEventListener("click", outsideClick);
        };
    }, [isDropDownShow]);

    return (
        <div className="flex h-250 w-full flex-col py-10">
            <div
                className="flex flex-col rounded-2xl border-1 border-primary px-12 py-6"
                ref={dropdownRef}
                onClick={() => setIsDropDownShow(true)}
            >
                {selectedTags.length > 0 ? (
                    <ol className="flex flex-wrap items-center">
                        {selectedTags.map((v) => (
                            <li key={v} className="flex w-fit items-center px-8">
                                <Typography type="Highlight" text={v} styles="font-extrabold mr-4 mt-2" />
                                <button onClick={() => filterSuggestion(v)}>
                                    <AiFillCloseCircle />
                                </button>
                            </li>
                        ))}
                    </ol>
                ) : null}
                <input
                    value={text}
                    onChange={(e) => setText(e.currentTarget.value)}
                    className="px-8 outline-none"
                    placeholder="기술 스택을 입력해주세요."
                />
            </div>

            <div className="relative flex-1">
                {isDropDownShow ? (
                    <ol className="absolute top-8 z-10 flex h-180 w-full flex-wrap overflow-y-scroll rounded-2xl border-1 border-primary bg-white p-8">
                        {suggestions.map((v) => (
                            <li
                                key={v}
                                className="m-2 h-fit w-max cursor-pointer rounded-2xl border-1 border-borderline bg-gray-50 px-8 py-6 hover:bg-background"
                                onClick={() => selectSuggestion(v)}
                            >
                                <Typography type="SmallLabel" text={v} styles="font-extrabold" />
                            </li>
                        ))}
                    </ol>
                ) : null}
            </div>
        </div>
    );
}

export default AutoCompletionTags;