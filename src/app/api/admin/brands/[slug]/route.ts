import { Brand } from "@/models/Brand";
import { namedRefRoutes } from "@/lib/namedRefRoutes";

export const { PUT, DELETE } = namedRefRoutes({ model: Brand, label: "brand", imageField: "logo" });
