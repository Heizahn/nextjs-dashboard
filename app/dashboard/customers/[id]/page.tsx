
import { getCustomer} from '@/app/lib/actions/actionsGetCustomer';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const [customer] = await Promise.all([
    getCustomer(id),
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <main>
      <h1 className="text-xl md:text-2xl">Cliente encontrado</h1>

    </main>
  );
}
