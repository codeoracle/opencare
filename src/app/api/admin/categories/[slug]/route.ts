import { Category } from "@/models/Category";
import { namedRefRoutes } from "@/lib/namedRefRoutes";

export const { PUT, DELETE } = namedRefRoutes({ model: Category, label: "category", imageField: "image" });
