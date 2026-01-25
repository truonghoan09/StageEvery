import './SystemProfileSection.scss'

/**
 * SystemProfileSection
 * ---------------------
 * User system profile
 * - Required information to unlock StageEvery
 * - NOT artist public profile
 */
export default function SystemProfileSection() {
  return (
    <section className="dashboard-system-profile">
      <h2>System Profile</h2>
      <p>Please complete your profile to continue using StageEvery.</p>
    </section>
  )
}
