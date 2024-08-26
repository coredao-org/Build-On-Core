'use client';
import { ValidatorContent } from '@/app/validator/[slug]/index';
import { ValidatorProvider } from '@/provider/validator-provider';

export default function ValidatorPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <ValidatorProvider>
      <ValidatorContent validatorAddress={params.slug} />
    </ValidatorProvider>
  );
}
