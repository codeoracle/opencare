import { Brand } from "@/models/Brand";
import { namedRefRoutes } from "@/lib/namedRefRoutes";

export const { POST } = namedRefRoutes({ model: Brand, label: "brand", imageField: "logo" });
