import CourseEditDetailsPage from "@/src/views/Platform/CoursesPage/Course[id]/Edit/CourseEditDetailsPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function Editcourse({ params }) {
    return (
        <ConditionalSessionRender
            AuthorizedUserRoles={[3, 4]}
            ComponentIfUser={<CourseEditDetailsPage courseId={params.id} />}
            ComponentIfNoUser={<NotPermissionPage/>}
        />
    );
}
