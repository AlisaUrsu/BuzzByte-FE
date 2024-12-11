import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { fetchTags } from "@/services/postService";
import { User } from "@/app/auth/signup/page";

type ButtonProps = {
    label: string;
    selected: boolean;
    onClick: () => void;
};

const CategoryPickButton = ({ label, selected, onClick }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 m-1 rounded-full ${selected ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
        >
            {label}
        </button>
    );
};

type CategoryPickPageProps = {
    onSubmit: (categories: string[]) => void,
    user: User
}

const CategoryPickPage = ({ onSubmit, user }: CategoryPickPageProps) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
   
    useEffect(() => {
        async function loadTags() {
            try {
              const tagsDto = await fetchTags({ pageNumber: 0, pageSize: 100 });
              setAvailableTags(tagsDto.items.map((tag) => tag.name));
            } catch (error) {
              console.error("Error fetching tags:", error);
            }
          }
          loadTags();
    }, []);


    const toggleCategory = (category: string) => {
        setSelectedTags((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    return (
        <div className="w-full min-h-[60%] px-10">
            <div className="flex-1 flex flex-col justify-center items-center text-white p-8">
                <h1 className="text-4xl font-semibold mb-4">Find content that interests you</h1>
                <p className="text-lg text-center">
                    Choose at least 5 categories
                </p>
            </div>

            <div className="border rounded-lg shadow-md p-4 bg-white">

                <div className="flex justify-center pb-3">
                    <h2 className="text-lg font-semibold">Selected Categories</h2>
                </div>

                <div className="flex flex-wrap mb-2 h-10">
                    {selectedTags.map((category) => (
                        <span key={category} className="bg-purple-900 text-white px-3 py-1 rounded-full m-1">
                            {category}
                        </span>
                    ))}
                </div>

                <hr className="m-3"></hr>
                <div className="flex justify-center pb-3"><h2 className="text-lg font-semibold">Select More</h2></div>


                <div className="flex justify-center">
                    <div className="overflow-auto min-h-40 ">
                        {availableTags.map((tag) => (
                            <CategoryPickButton
                                key={tag}
                                label={tag}
                                selected={selectedTags.includes(tag)}
                                onClick={() => toggleCategory(tag)}
                            />
                        ))}
                    </div>
                </div>

                <div className="m-5 flex justify-end">
                    <Button type="submit" disabled={selectedTags.length < 5} onClick={() => onSubmit(selectedTags)}>Submit</Button>
                </div>

            </div>
        </div>
    );
};

export default CategoryPickPage;
