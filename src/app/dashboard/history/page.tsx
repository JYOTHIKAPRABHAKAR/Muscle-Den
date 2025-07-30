
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getFitnessPlanHistory } from "../actions";
import { History } from "lucide-react";

export default async function HistoryPage() {
  const { success, plans, error } = await getFitnessPlanHistory();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
           <div className="flex items-center gap-2 mb-2">
              <History className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Plan History</CardTitle>
            </div>
          <CardDescription>
            Here are the most recent fitness plans you've generated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
             <div className="flex flex-col items-center justify-center text-center text-destructive-foreground bg-destructive p-4 rounded-md">
                <p className="font-semibold">Failed to load history</p>
                <p className="text-sm">{error}</p>
             </div>
          )}
          {success && plans && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Goals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length > 0 ? (
                  plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{plan.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{plan.fitnessGoals}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No plans generated yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
