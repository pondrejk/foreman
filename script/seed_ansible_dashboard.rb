# Run through Foreman's Rails runner or load in its Rails console.
# See developer_docs/ansible-dashboard-reproducer.asciidoc.
# Optional environment variables: ORG, LOCATION, ACTION=cleanup.

User.current = User.unscoped.find_by!(admin: true)
Organization.current = nil
Location.current = nil

marker = 'Synthetic Ansible dashboard demo data'
cleanup = ENV['ACTION'] == 'cleanup'
scenarios = {
  'ok-1' => {},
  'ok-2' => {},
  'ok-3' => {},
  'active-1' => { 'applied' => 3 },
  'active-2' => { 'applied' => 1 },
  'error' => { 'failed' => 1 },
  'pending' => { 'pending' => 2 },
  'out-of-sync' => {},
  'disabled' => {},
}

unless cleanup
  organization = Organization.find_by!(name: ENV.fetch('ORG', 'Default Organization'))
  location = Location.find_by!(name: ENV.fetch('LOCATION', 'Default Location'))
  interval = Setting[:ansible_interval].to_i
  raise 'Ansible report interval must be positive' unless interval.positive?
end

ActiveRecord::Base.transaction do
  scenarios.each do |scenario, counters|
    name = "ansible-dashboard-#{scenario}.example.test"
    host = Host::Managed.find_by(name: name)
    if host && host.comment != marker
      raise "Refusing to modify unrelated host #{name}"
    end

    if cleanup
      host&.destroy!
      next
    end

    host ||= Host::Managed.new(
      name: name,
      managed: false,
      build: false,
      comment: marker,
      organization: organization,
      location: location
    )
    host.enabled = scenario != 'disabled'
    host.save!

    reported_at = scenario == 'out-of-sync' ? (interval + 60).minutes.ago : Time.current
    status = ConfigReport::METRIC.each_with_object({}) do |metric, result|
      result[metric] = counters.fetch(metric, 0)
    end
    report = ConfigReport.create!(
      host: host,
      origin: 'Ansible',
      reported_at: reported_at,
      status: status,
      metrics: { time: { total: 2.5 }, resources: { total: 5 } }
    )
    report.logs.create!(
      level: scenario == 'error' ? :err : :notice,
      source: Source.find_or_create_by!(value: 'Ansible dashboard demo'),
      message: Message.find_or_create_by!(
        value: "Synthetic #{scenario} report for dashboard testing"
      )
    )

    host.update!(last_report: reported_at)
    host.refresh_statuses([HostStatus::ConfigurationStatus])
  end

  puts Dashboard::Data.new('name ~ ansible-dashboard-', origin: 'Ansible').report.to_json
end
