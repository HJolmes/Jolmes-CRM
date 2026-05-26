DELETE FROM public."Customer" a USING public."Customer" b WHERE a.name = b.name AND a.id < b.id;
