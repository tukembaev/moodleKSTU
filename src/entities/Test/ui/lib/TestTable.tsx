import { TestResult } from "entities/Test/model/types/test";
import { LuCheckCheck, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";

const TestTable = ({ data }: { data: TestResult[] }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="hover:bg-transparent ">
            <TableHead className="w-[300px]">Имя студента</TableHead>
            <TableHead className="w-[100px]">Группа</TableHead>
            <TableHead className="w-[130px]">Статус сдачи</TableHead>
            {/* <TableHead>Доступ</TableHead> */}
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((student) => (
            <>
              <TableRow key={student.id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                  </Avatar>
                  <p
                    className="cursor-pointer hover:border-b-1"
                    onClick={() => navigate(`/profile/${student.user_id}`)}
                  >
                    {student.name}
                  </p>
                </TableCell>
                <TableCell>{student.group}</TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 cursor-pointer "
                  >
                    {student.result ? (
                      <LuCheckCheck className="text-green-500 dark:text-green-400" />
                    ) : (
                      <LuX />
                    )}
                    {student.result ? `Сдано на ${student.result}` : "Не сдано"}
                  </Badge>
                </TableCell>
                {/* 
                <TableCell
                  colSpan={6}
                  className="flex justify-end cursor-pointer"
                >
                  <span>as</span>
                </TableCell> */}
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TestTable;
