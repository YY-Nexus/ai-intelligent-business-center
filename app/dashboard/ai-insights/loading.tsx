import { TechLayout } from "@/components/layout/tech-layout"
import { TechCard } from "@/components/ui/tech-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AiInsightsLoading() {
  return (
    <TechLayout backgroundVariant="vortex" backgroundIntensity="light">
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-9 w-32" />
          <div className="h-6 border-l border-border"></div>
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-[200px]" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <TechCard key={i} variant="glass" border="tech" contentClassName="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </TechCard>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <TechCard variant="glass" border="tech" className="mb-6">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                </div>
              </div>

              <div className="px-4 pt-2">
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>

              <div className="px-4 pb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-4 border-b border-border last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-border flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            </TechCard>
          </div>

          <div className="w-full lg:w-1/4">
            <TechCard variant="glass" border="tech" className="mb-6">
              <div className="p-4 border-b border-border">
                <Skeleton className="h-6 w-32" />
              </div>

              <div className="p-6 flex flex-col items-center justify-center h-[400px]">
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-64 mb-4" />
                <Skeleton className="h-9 w-40" />
              </div>
            </TechCard>

            <TechCard variant="glass" border="tech">
              <div className="p-4 border-b border-border">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ))}

                <Skeleton className="h-9 w-full mt-2" />
              </div>
            </TechCard>
          </div>
        </div>
      </div>
    </TechLayout>
  )
}
