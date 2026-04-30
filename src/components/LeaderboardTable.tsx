"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LeaderboardTableProps {
  data: Array<{
    address: string;
    balance: number;
    rank: number;
  }>;
  loading?: boolean;
}

export function LeaderboardTable({ data, loading }: LeaderboardTableProps) {
  if (loading) {
    return <p className="py-8 text-center text-muted-foreground">Loading leaderboard...</p>;
  }

  if (!data.length) {
    return <p className="py-8 text-center text-muted-foreground">No data available</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Address</TableHead>
          <TableHead className="text-right">Balance (XLM)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry) => (
          <TableRow key={entry.address}>
            <TableCell>
              {entry.rank === 1 ? (
                <Badge variant="default">1</Badge>
              ) : entry.rank === 2 ? (
                <Badge variant="secondary">2</Badge>
              ) : entry.rank === 3 ? (
                <Badge variant="outline">3</Badge>
              ) : (
                <span>{entry.rank}</span>
              )}
            </TableCell>
            <TableCell className="font-mono text-sm">
              {entry.address.slice(0, 12)}...{entry.address.slice(-8)}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {entry.balance.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
