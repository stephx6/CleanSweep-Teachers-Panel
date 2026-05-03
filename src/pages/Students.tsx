import DefaultLayout from "../layout/DefaultLayout"
import StudentsTable from "../components/students/StudentsTable"

export default function Students(){
    return(
        <>
            <DefaultLayout>
                <StudentsTable />
            </DefaultLayout>
        </>
    )
}