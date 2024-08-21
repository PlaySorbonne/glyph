import { getUsers } from "@/actions/users"
import Table from "../../components/Table"

export default async function AllUsersPage() {
    return (
        <div>
            <h1>Utilisateurs</h1>
            <Table data={(await getUsers()).map((u) => {return {...u, href: `/admin/user/${u.id}`}})} />
        </div>
    )
}