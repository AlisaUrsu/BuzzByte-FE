import { useState } from "react";
import { Button } from "@/components/ui/button"

type ButtonProps = {
    label: string;
    selected: boolean;
    onClick: () => void;
};

const CategoryPickButton = ({ label, selected, onClick }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 m-1 rounded-full ${selected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
        >
            {label}
        </button>
    );
};

type CategoryPickPageProps = {
    onSubmit: (categories: string[]) => void
}

const CategoryPickPage = ({ onSubmit }: CategoryPickPageProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    //hardcoded categories

    const categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"];

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    return (
        <div className="border rounded-lg shadow-md p-4">

            <h2 className="text-lg font-semibold">Selected Categories</h2>
            <div className="flex flex-wrap mb-2 h-10">
                {selectedCategories.map((category) => (
                    <span key={category} className="bg-blue-500 text-white px-3 py-1 rounded-full m-1">
                        {category}
                    </span>
                ))}
            </div>

            <hr className="m-3"></hr>
            <h2 className="text-lg font-semibold">Select More</h2>
            <div className="overflow-auto max-h-40">
                {categories.map((category) => (
                    <CategoryPickButton
                        key={category}
                        label={category}
                        selected={selectedCategories.includes(category)}
                        onClick={() => toggleCategory(category)}
                    />
                ))}
            </div>

            <div className="m-5 flex justify-end">
                <Button type="submit" disabled={selectedCategories.length < 3} onClick={() => onSubmit(selectedCategories)}>Submit</Button>
            </div>

        </div>
    );
};

export default CategoryPickPage;
