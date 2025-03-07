import { Card } from '@/components/ui/card';
import React from 'react';

const DocumentsTable = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  return (
    <Card style={{ height, width }} className="bg-slate-500">
      DocumentsTable
    </Card>
  );
};

export default DocumentsTable;
