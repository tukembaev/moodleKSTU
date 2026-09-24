import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { DEPARTMENT_PERMISSION } from "entities/User/lib/permissions";
import { useHasPermission } from "entities/User/model/useHasPermission";
import AccessDenied from "shared/components/AccessDenied";
import { WorkloadCatalog } from "./WorkloadCatalog";

const WorkloadPage = () => {
  const { t } = useTranslation();
  const { hasAccess, isLoading } = useHasPermission(DEPARTMENT_PERMISSION);
  const [params, setParams] = useSearchParams();
  const departmentId = params.get("department");

  const selectDepartment = useCallback(
    (id: string) => {
      const search = new URLSearchParams();
      search.set("department", id);
      setParams(search);
    },
    [setParams]
  );

  const goBack = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="hidden text-4xl font-semibold tracking-tight md:block sm:text-5xl">
          {t("Нагрузка")}
        </h2>
        <p className="text-sm text-muted-foreground md:mt-1.5 md:text-lg">
          {t("Кафедры, преподаватели и загрузка материалов на курсах")}
        </p>
      </div>

      <WorkloadCatalog
        departmentId={departmentId}
        onSelectDepartment={selectDepartment}
        onBack={goBack}
      />
    </div>
  );
};

export default WorkloadPage;
