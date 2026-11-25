import { Category } from "@/models/Category";
import { namedRefRoutes } from "@/lib/namedRefRoutes";

export const { POST } = namedRefRoutes({ model: Category, label: "category", imageField: "image" });
