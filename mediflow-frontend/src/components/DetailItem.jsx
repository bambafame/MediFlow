function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-500">{label}</dt>

      <dd className="mt-1 text-base font-medium text-slate-900">
        {value || "—"}
      </dd>
    </div>
  );
}

export default DetailItem;
