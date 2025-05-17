import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import CoursesPage from "@/src/views/Platform/CoursesPage/Courses/CoursesPage";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function Courses() {
    return (
        <ConditionalSessionRender
            ComponentIfUser={<CoursesPage/>}
            ComponentIfNoUser={<NotPermissionPage/>}
        />
    );
}
