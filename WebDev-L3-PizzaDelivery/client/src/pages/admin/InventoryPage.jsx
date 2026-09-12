import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  Package,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdminInventory,
  updateInventoryItem,
} from "../../services/adminService";

const CATEGORY_LABELS = {
  base: "Pizza Bases",
  sauce: "Sauces",
  cheese: "Cheeses",
  vegetable: "Vegetables",
};

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const loadInventory = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");

    try {
      const data = await getAdminInventory();
      const inventory = Array.isArray(data?.inventory)
        ? data.inventory
        : [];

      setItems(inventory);

      const newDrafts = {};

      inventory.forEach((item) => {
        newDrafts[item._id] = {
          stock: item.stock,
          threshold: item.lowStockThreshold ?? 20,
        };
      });

      setDrafts(newDrafts);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Could not load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();

    const refreshInterval = window.setInterval(() => {
      loadInventory(true);
    }, 5000);

    return () => window.clearInterval(refreshInterval);
  }, []);

  const groupedItems = useMemo(() => {
    return Object.keys(CATEGORY_LABELS).map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      items: items.filter((item) => item.category === category),
    }));
  }, [items]);

  const lowStockCount = items.filter(
    (item) =>
      Number(item.stock) <=
      Number(item.lowStockThreshold ?? 20)
  ).length;

  const activeCategories = groupedItems.filter(
    (group) => group.items.length > 0
  ).length;

  const saveItem = async (item) => {
    const draft = drafts[item._id];

    const stock = Number(draft?.stock);
    const threshold = Number(draft?.threshold);

    if (
      !Number.isInteger(stock) ||
      stock < 0 ||
      !Number.isInteger(threshold) ||
      threshold < 0
    ) {
      toast.error(
        "Stock and threshold must be whole numbers of 0 or more."
      );
      return;
    }

    setSavingId(item._id);

    try {
      const data = await updateInventoryItem(item._id, {
        stock,
        lowStockThreshold: threshold,
      });

      setItems((current) =>
        current.map((currentItem) =>
          currentItem._id === item._id
            ? data.inventory
            : currentItem
        )
      );

      setDrafts((current) => ({
        ...current,
        [item._id]: {
          stock: data.inventory.stock,
          threshold:
            data.inventory.lowStockThreshold ?? 20,
        },
      }));

      toast.success(`${item.name} updated`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not update inventory."
      );
    } finally {
      setSavingId("");
    }
  };

  const updateDraft = (id, field, value) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c1442d]">
            Operations
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-[#1c1712]">
            Inventory
          </h2>

          <p className="mt-2 text-sm text-[#806f60]">
            Manage ingredient stock and low-stock alerts.
          </p>
        </div>

        <button
          onClick={loadInventory}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#eadfd2] bg-white px-4 py-2 text-sm font-bold text-[#5c4f42] shadow-sm hover:border-[#c1442d] disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Tracked items"
          value={items.length}
        />

        <Metric
          label="Low stock"
          value={lowStockCount}
          warning
        />

        <Metric
          label="Categories"
          value={activeCategories}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-5">
        {groupedItems.map((group) => (
          <div
            key={group.category}
            className="overflow-hidden rounded-xl border border-[#eee5d9] bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 border-b border-[#f1e9df] px-5 py-4">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#fff0df] text-[#c1442d]">
                <Package className="h-4 w-4" />
              </div>

              <div>
                <h3 className="font-black text-[#1c1712]">
                  {group.label}
                </h3>

                <p className="text-xs text-[#806f60]">
                  {group.items.length}{" "}
                  {group.items.length === 1
                    ? "item"
                    : "items"}
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#f1e9df]">
              {group.items.map((item) => {
                const draft = drafts[item._id] || {};

                const isLow =
                  Number(item.stock) <=
                  Number(item.lowStockThreshold ?? 20);

                const isSaving = savingId === item._id;

                return (
                  <div
                    key={item._id}
                    className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_150px_150px_110px] lg:items-end"
                  >
                    <div>
                      <p className="font-bold text-[#1c1712]">
                        {item.name}
                      </p>

                      <p className="mt-2 text-sm font-bold text-[#1c1712]">
                        Available: {item.stock}
                      </p>

                      <p
                        className={`mt-1 text-xs font-medium ${
                          isLow
                            ? "text-[#c1442d]"
                            : "text-[#806f60]"
                        }`}
                      >
                        {isLow
                          ? "Low stock"
                          : "Stock level is good"}
                      </p>
                    </div>

                    <Field
                      label="Stock"
                      value={draft.stock}
                      onChange={(value) =>
                        updateDraft(
                          item._id,
                          "stock",
                          value
                        )
                      }
                    />

                    <Field
                      label="Alert at"
                      value={draft.threshold}
                      onChange={(value) =>
                        updateDraft(
                          item._id,
                          "threshold",
                          value
                        )
                      }
                    />

                    <button
                      onClick={() => saveItem(item)}
                      disabled={isSaving}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#c1442d] px-3 text-sm font-bold text-white hover:bg-[#a93624] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}

                      Save
                    </button>
                  </div>
                );
              })}

              {!loading && group.items.length === 0 && (
                <p className="px-5 py-6 text-sm text-[#806f60]">
                  No items in this category.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value, warning = false }) {
  return (
    <div className="rounded-xl border border-[#eee5d9] bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-[#806f60]">
        {label}
      </p>

      <p
        className={`mt-1 text-2xl font-black ${
          warning && value > 0
            ? "text-[#c1442d]"
            : "text-[#1c1712]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label>
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#806f60]">
        {label}
      </span>

      <input
        type="number"
        min="0"
        step="1"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#eadfd2] px-3 py-2 text-sm font-bold text-[#1c1712] outline-none focus:border-[#c1442d] focus:ring-2 focus:ring-[#c1442d]/15"
      />
    </label>
  );
}

export default InventoryPage;