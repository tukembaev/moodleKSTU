import { GroupDetail, GroupList } from "entities/Group";

const GroupPage = () => {
  const student = false;
  return <div>{student ? <GroupDetail /> : <GroupList />}</div>;
};

export default GroupPage;
