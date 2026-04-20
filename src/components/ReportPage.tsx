import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Report = {
  kmDia: number;
  vehiculos: number;
  kmMes: number;
  costeDiesel: number;
  costeEv: number;
  ahorro: number;
};

type Company = {
  name: string;
  reports: Report[];
  hasSubscription: boolean;
};

type CompaniesMap = Record<string, Company>;

const DIESEL_COST_PER_KM = 0.12;
const EV_COST_PER_KM = 0.04;
const WORKING_DAYS_PER_MONTH = 22;

function calculateReport(kmDia: number, vehiculos: number): Report {
  const kmMes = kmDia * vehiculos * WORKING_DAYS_PER_MONTH;
  const costeDiesel = kmMes * DIESEL_COST_PER_KM;
  const costeEv = kmMes * EV_COST_PER_KM;
  const ahorro = costeDiesel - costeEv;
  return { kmDia, vehiculos, kmMes, costeDiesel, costeEv, ahorro };
}

function formatCurrency(value: number): string {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });
}

const STORAGE_KEY = "electrofik-companies";

function loadCompanies(): CompaniesMap {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as CompaniesMap;
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveCompanies(companies: CompaniesMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
}

export default function ReportPage() {
  const [companies, setCompanies] = useState<CompaniesMap>(loadCompanies);
  const [companyName, setCompanyName] = useState("");
  const [kmDia, setKmDia] = useState("");
  const [vehiculos, setVehiculos] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    saveCompanies(companies);
  }, [companies]);

  const companyList = useMemo(
    () => Object.values(companies).sort((a, b) => a.name.localeCompare(b.name)),
    [companies]
  );

  const handleAddCompany = () => {
    const name = companyName.trim();
    if (!name || companies[name]) return;
    setCompanies((prev) => ({
      ...prev,
      [name]: { name, reports: [], hasSubscription: false },
    }));
    setCompanyName("");
    setSelectedCompany(name);
  };

  const handleAddReport = () => {
    if (!selectedCompany) return;
    const km = parseFloat(kmDia);
    const veh = parseInt(vehiculos, 10);
    if (isNaN(km) || isNaN(veh) || km <= 0 || veh <= 0) return;

    const report = calculateReport(km, veh);
    setCompanies((prev) => ({
      ...prev,
      [selectedCompany]: {
        ...prev[selectedCompany],
        reports: [...prev[selectedCompany].reports, report],
      },
    }));
    setKmDia("");
    setVehiculos("");
  };

  const handleToggleSubscription = (name: string) => {
    setCompanies((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        hasSubscription: !prev[name].hasSubscription,
      },
    }));
  };

  const handleDeleteCompany = (name: string) => {
    setCompanies((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    if (selectedCompany === name) {
      setSelectedCompany(null);
    }
  };

  const selected = selectedCompany ? companies[selectedCompany] : null;

  const totalSavings = useMemo(() => {
    if (!selected) return 0;
    return selected.reports.reduce((sum, r) => sum + r.ahorro, 0);
  }, [selected]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Electrofik</h1>
          <p className="text-muted-foreground mt-1">
            Comparativa de costes: Diésel vs Vehículo Eléctrico
          </p>
        </header>

        {/* Add company */}
        <Card>
          <CardHeader>
            <CardTitle>Añadir empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la empresa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCompany()}
              />
              <Button onClick={handleAddCompany}>Añadir</Button>
            </div>
          </CardContent>
        </Card>

        {/* Company list */}
        {companyList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {companyList.map((company) => (
                  <div
                    key={company.name}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedCompany === company.name
                        ? "border-primary bg-accent"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedCompany(company.name)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{company.name}</span>
                      {company.hasSubscription && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Suscripción activa
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {company.reports.length} informe(s)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSubscription(company.name);
                        }}
                      >
                        {company.hasSubscription
                          ? "Cancelar suscripción"
                          : "Suscribir"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCompany(company.name);
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected company: add report */}
        {selected && (
          <Card>
            <CardHeader>
              <CardTitle>Nuevo informe para {selected.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Km/día por vehículo"
                  value={kmDia}
                  onChange={(e) => setKmDia(e.target.value)}
                />
                <Input
                  type="number"
                  min="1"
                  placeholder="Nº de vehículos"
                  value={vehiculos}
                  onChange={(e) => setVehiculos(e.target.value)}
                />
                <Button onClick={handleAddReport}>Generar informe</Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Costes estimados: Diésel {DIESEL_COST_PER_KM} €/km · EV{" "}
                {EV_COST_PER_KM} €/km · {WORKING_DAYS_PER_MONTH} días
                laborables/mes
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reports table */}
        {selected && selected.reports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Informes de {selected.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2">#</th>
                      <th className="p-2">Km/día</th>
                      <th className="p-2">Vehículos</th>
                      <th className="p-2">Km/mes</th>
                      <th className="p-2">Coste Diésel</th>
                      <th className="p-2">Coste EV</th>
                      <th className="p-2">Ahorro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.reports.map((report, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{report.kmDia}</td>
                        <td className="p-2">{report.vehiculos}</td>
                        <td className="p-2">
                          {report.kmMes.toLocaleString("es-ES")}
                        </td>
                        <td className="p-2">
                          {formatCurrency(report.costeDiesel)}
                        </td>
                        <td className="p-2">
                          {formatCurrency(report.costeEv)}
                        </td>
                        <td className="p-2 font-semibold text-green-700">
                          {formatCurrency(report.ahorro)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <div className="rounded-lg bg-green-50 px-4 py-2 text-right">
                  <p className="text-sm text-muted-foreground">
                    Ahorro total mensual
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(totalSavings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {companyList.length === 0 && (
          <p className="text-center text-muted-foreground">
            Añade una empresa para comenzar a generar informes comparativos.
          </p>
        )}
      </div>
    </div>
  );
}
